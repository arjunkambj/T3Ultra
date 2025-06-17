import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: Request): Promise<Response> {
  const { messages, agentId, chatId } = await request.json();

  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return response.toDataStreamResponse();
}
