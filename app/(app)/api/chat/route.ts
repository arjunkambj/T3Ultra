import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { perplexity } from "@ai-sdk/perplexity";
import { xai } from "@ai-sdk/xai";

import { getCurrentTime, InteractWithGoogleSearch } from "./tools";
import { addToMemory } from "./tools";

import { generateTitleFromUserMessage } from "@/actions/ai-action";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const { messages, chatId, userId, modelId, isSearchEnabled } =
    await req.json();

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
  You are a helpful assistant that can answer questions. 
   Speak in humanly manner and use emojis to make it more engaging not more than 1 emoji per message.
   if using tools, share messge with readable format.

   Note: 
   userID: ${userId} for the addToMemory tool.
   
   EXISTING USER MEMORY: 
   ${memory || "No existing memories found."}
   
   USER CUSTOMIZATIONS:
   ${
     customizations
       ? `
   - What to call user: ${customizations.whattocalluser || "Not specified"}
   - What user does: ${customizations.whatuserdoes || "Not specified"}
   - LLM traits: ${customizations.traitsforllm?.join(", ") || "Not specified"}
   - User preferences: ${customizations.preferencesofuser?.join(", ") || "Not specified"}
   - Additional notes: ${customizations.anythingelse || "Not specified"}
   `
       : "No customizations found."
   }
   
   IMPORTANT MEMORY RULES:
   - Use the existing memory above to personalize your responses
   - ONLY use addToMemory tool if the user shares completely NEW information that is NOT already in their existing memory
   - Before adding any memory, carefully check if similar information already exists in the existing memory above
   - Do NOT add duplicate or redundant information to memory
   - Only add truly new personal details, preferences, or important information about the user
   
   CUSTOMIZATION INSTRUCTIONS:
   - Follow the user customizations above to tailor your responses
   - Use the specified name/title when addressing the user
   - Adapt your communication style based on the LLM traits specified
   - Consider the user's preferences and what they do when providing responses
   - Incorporate any additional notes from the customizations
   `;

  const userModel = [
    openai("gpt-4o-mini"),
    openai("gpt-4.1-mini"),
    google("gemini-2.5-flash-preview-04-17"),
    google("gemini-2.5-flash-preview-04-17"),
    xai("grok-3-mini"),
  ];

  // Ensure modelId is within valid range
  const selectedModelIndex = Math.max(
    0,
    Math.min(modelId, userModel.length - 1),
  );
  const selectedModel = userModel[selectedModelIndex];

  const result = streamText({
    model: isSearchEnabled ? perplexity("sonar-pro") : selectedModel,
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
        });

        // Update chat title if this is the first exchange
        if (messages.length === 1 && messages[0].role === "user") {
          const title = await generateTitleFromUserMessage({
            message: messages[0],
          });

          await convex.mutation(api.function.chats.updateChatTitle, {
            chatId,
            title,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error saving assistant message:", error);
      }
    },
  });

  return result.toDataStreamResponse();
}
