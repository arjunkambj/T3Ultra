import { streamText, generateText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { openai } from "@ai-sdk/openai";
import { getCurrentTime, InteractWithGoogleSearch } from "./tools";
import { addToMemory } from "./tools";

import { api } from "@/convex/_generated/api";

export const runtime = "edge";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const {
    messages,
    chatId,
    userId,
    modelId,
    isSearchEnabled,
    systemPromptData,
  } = await req.json();

  if (!chatId && !userId) {
    return new Response(JSON.stringify({ error: "Please login to continue" }), {
      status: 400,
    });
  }

  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "user") {
      try {
        convex.mutation(api.function.messages.addMessageToChat, {
          chatId,
          content: lastMessage.content,
          role: "user",
          experimental_attachments: lastMessage.experimental_attachments,
          parts: lastMessage.parts,
        });
        convex.mutation(api.function.chats.updateChatUpdatedAt, {
          chatId,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error saving user message:", error);
      }
    }
  }

  const systemPrompt = `
  You are a helpful assistant who speaks in a human-like way. Add 1 emoji per message for engagement, no more.

  Only use tools when necessary. If you do, explain results clearly and in plain language.

  USER INFO:
  - userID: ${userId} (use with memory tools)
  - Call the user: ${systemPromptData?.whattocalluser || ""}
  - What user does: ${systemPromptData?.whatuserdoes || "Not specified"}
  - Traits: ${systemPromptData?.traitsforllm?.join(", ") || "Not specified"}
  - Preferences: ${systemPromptData?.preferencesofuser?.join(", ") || "Not specified"}
  - Extra notes: ${systemPromptData?.anythingelse || "Not specified"}

  EXISTING MEMORY:
  ${systemPromptData?.memory || "No existing memories found."}

  MEMORY RULES:
  - Personalize using existing memory
  - Only call addToMemory if new info is shared
  - Don't duplicate or re-add what's already stored
   `;

  const userModel = [
    openrouter("openai/gpt-4o-mini"),
    openrouter("openai/gpt-4.1-mini"),
    openrouter("openai/gpt-4.1"),
    openrouter("google/gemini-2.5-flash-preview-05-20"),
    openrouter("google/gemini-2.5-pro-preview"),
    openrouter("x-ai/grok-3-mini-beta"),
    openrouter("x-ai/grok-3-beta"),
    openrouter("openai/o3-mini"),
    openrouter("deepseek/deepseek-chat-v3-0324"),
    openrouter("deepseek/deepseek-r1-0528"),
    openrouter("qwen/qwen3-235b-a22b"),
    openai("gpt-4o-2024-11-20"),
  ];

  // Ensure modelId is within valid range
  const selectedModelIndex = Math.max(
    0,
    Math.min(modelId, userModel.length - 1),
  );
  const selectedModel = userModel[selectedModelIndex];

  const result = streamText({
    model: isSearchEnabled ? openrouter("perplexity/sonar") : selectedModel,
    system: systemPrompt,
    messages,
    maxSteps: 10,

    tools: {
      internetSearch: InteractWithGoogleSearch,
      getCurrentTime: getCurrentTime,
      addToMemory: addToMemory,
    },
    onFinish: async (result) => {
      try {
        // Run database operations in parallel for better performance
        const operations: Promise<any>[] = [
          // Save assistant message to database
          convex.mutation(api.function.messages.addMessageToChat, {
            chatId,
            content: result.text,
            role: "assistant",
            modelUsed: modelId.toString(),
          }),
        ];

        // Update chat title if this is the first exchange
        if (messages.length === 1 && messages[0].role === "user") {
          const titleOperation = generateText({
            model: openrouter("openai/gpt-4o-mini"),
            system: `\n
              - you will generate a short title based on the first message a user begins a conversation with
              - ensure it is not more than 3 words long and capitalize the first letter
              - the title should be a summary of the user's message
              - do not use quotes or colons`,
            prompt: messages[0].content,
          }).then((result) =>
            convex.mutation(api.function.chats.updateChatTitle, {
              chatId,
              title: result.text,
            }),
          );

          operations.push(titleOperation);
        }

        // Execute all operations in parallel
        await Promise.allSettled(operations);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error in onFinish callback:", error);
        // Don't throw here to avoid breaking the stream
      }
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
