import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getCurrentTime, InteractWithGoogleSearch } from "./tools";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = `
  You are a helpful assistant that can answer questions and help with tasks.
  if using the tools, alway format the output in a readable way.
  
  `;

  try {
    const result = streamText({
      model: google("gemini-2.5-flash-preview-04-17"),
      messages,
      system: systemPrompt,
      tools: {
        dataAndTime: getCurrentTime,
        googleSearch: InteractWithGoogleSearch,
      },
      maxSteps: 10,
      toolCallStreaming: true,
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
