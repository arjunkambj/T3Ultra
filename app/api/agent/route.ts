import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";

import { addToMemory } from "../chat/tools";

import { getCurrentTime } from "./tools";

import { generateTitleFromUserMessage } from "@/actions/ai-action";
import { api } from "@/convex/_generated/api";

// Enable Edge Runtime
export const runtime = "edge";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const { messages, chatId, userId, modelId, agentId } = await req.json();

  if (!chatId && !userId) {
    return new Response(JSON.stringify({ error: "Please login to continue" }), {
      status: 400,
    });
  }

  if (!chatId) {
    return new Response(JSON.stringify({ error: "Chat ID is required" }), {
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

  const agentContext = await convex.query(api.function.agent.getAgentById, {
    agentId,
  });

  let systemPrompt = "";

  if (agentContext) {
    systemPrompt = `
    You are an agent that can answer questions.

You are ${agentContext.name || "a helpful AI agent"} 🤖

${agentContext.description ? `AGENT DESCRIPTION: ${agentContext.description}` : ""}

${agentContext.category ? `CATEGORY: ${agentContext.category}` : ""}

${
  agentContext.capabilities && agentContext.capabilities.length > 0
    ? `CAPABILITIES: ${agentContext.capabilities.join(", ")}`
    : ""
}

AGENT INSTRUCTIONS & BEHAVIOR:
${agentContext.instructions || "You are a agent that can answer questions and provide assistance and follow the instructions provided below."}

AGENT CONTEXT:
- Agent Name: ${agentContext.name || "AI Assistant"}
- Agent Role: ${agentContext.description || "General purpose assistant"}
- Specialized In: ${agentContext.category || "General assistance"}
- Key Abilities: ${agentContext.capabilities && agentContext.capabilities.length > 0 ? agentContext.capabilities.join(", ") : "General conversation and assistance"}
- Updated: ${agentContext.updatedAt ? new Date(agentContext.updatedAt).toLocaleDateString() : "Recently"}
    `;
  } else {
    systemPrompt = `
You are a helpful AI assistant 🤖
  `;
  }

  const userModel = [
    openai("gpt-4o-mini"),
    openai("gpt-4.1-mini"),
    google("gemini-2.5-flash-preview-04-17"),
    google("gemini-2.5-flash-preview-04-17"),
    xai("grok-3-mini"),
  ];

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
          }),
        ];

        if (messages.length === 1 && messages[0].role === "user") {
          const titleOperation = generateTitleFromUserMessage({
            message: messages[0],
          }).then((title) =>
            convex.mutation(api.function.chats.updateChatTitle, {
              chatId,
              title,
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

  return result.toDataStreamResponse();
}
