import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { getCurrentTime, InteractWithGoogleSearch } from "./tools";
import { generateTitleFromUserMessage } from "@/actions/ai-action";
import { api } from "@/convex/_generated/api";
import { openai } from "@ai-sdk/openai";
import { addToMemory } from "./tools";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const { messages, chatId, userId, modelId } = await req.json();

  const isAuthenticated = await isAuthenticatedNextjs();

  if (!chatId && !userId && !isAuthenticated) {
    return new Response(JSON.stringify({ error: "Please login to continue" }), {
      status: 400,
    });
  }

  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "user") {
      convex.mutation(api.function.messages.addMessageToChat, {
        chatId,
        content: lastMessage.content,
        role: "user",
      });
      convex.mutation(api.function.chats.updateChatUpdatedAt, {
        chatId,
      });
    }
  }

  const systemPrompt = `
  You are a helpful assistant that can answer questions. 
   Speak in humanly manner and use emojis to make it more engaging not more than 1 emoji per message.
   if using tools, share messge with readable format.

   Note: 
   userID: ${userId} for the addToMemory tool.

   `;

  const userModel = [
    openai("gpt-4o-mini"),
    openai("gpt-4.1-mini"),
    google("gemini-2.5-flash-preview-04-17"),
  ];

  // Ensure modelId is within valid range
  const selectedModelIndex = Math.max(
    0,
    Math.min(modelId, userModel.length - 1),
  );
  const selectedModel = userModel[selectedModelIndex];

  const result = streamText({
    model: selectedModel,
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
