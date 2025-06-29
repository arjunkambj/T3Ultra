import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { getCurrentTime, InteractWithGoogleSearch } from "./tools";
import { addToMemory } from "./tools";

import { generateTitleFromUserMessage } from "@/actions/ai-action";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, chatId, userId, modelId, isSearchEnabled } =
    await req.json();

  console.log(messages);

  const isAuthenticated = await isAuthenticatedNextjs();

  if (!chatId && !userId && !isAuthenticated) {
    return new Response(JSON.stringify({ error: "Please login to continue" }), {
      status: 400,
    });
  }

  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "user") {
      try {
        await convex.mutation(api.function.messages.addMessageToChat, {
          chatId,
          content: lastMessage.content,
          role: "user",
          experimental_attachments: lastMessage.experimental_attachments,
          parts: lastMessage.parts,
        });
        await convex.mutation(api.function.chats.updateChatUpdatedAt, {
          chatId,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error saving user message:", error);
      }
    }
  }

  const customizations = await convex.query(
    api.function.customizations.getCustomization,
    {
      userId: userId as any,
    },
  );

  const memory = await convex.query(api.function.memory.getMemory, {
    userId: userId as any,
  });

  const systemPrompt = `
  You are a helpful assistant who speaks in a human-like way. Add 1 emoji per message for engagement, no more.

  Only use tools when necessary. If you do, explain results clearly and in plain language.

  USER INFO:
  - userID: ${userId} (use with memory tools)
  - Call the user: ${customizations?.whattocalluser || "My Lord"}
  - What user does: ${customizations?.whatuserdoes || "Not specified"}
  - Traits: ${customizations?.traitsforllm?.join(", ") || "Not specified"}
  - Preferences: ${customizations?.preferencesofuser?.join(", ") || "Not specified"}
  - Extra notes: ${customizations?.anythingelse || "Not specified"}

  EXISTING MEMORY:
  ${memory || "No existing memories found."}

  MEMORY RULES:
  - Personalize using existing memory
  - Only call addToMemory if new info is shared
  - Don’t duplicate or re-add what's already stored
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
        // Save assistant message to database
        await convex.mutation(api.function.messages.addMessageToChat, {
          chatId,
          content: result.text,
          role: "assistant",
          modelUsed: modelId.toString(),
        });

        // Update chat title if this is the first exchange
        if (messages.length === 1 && messages[0].role === "user") {
          const title = await generateTitleFromUserMessage({
            message: messages[0],
          });

          await convex.mutation(api.function.chats.updateChatTitle, {
            chatId,
            title: title as any,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error saving assistant message:", error);
      }
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
