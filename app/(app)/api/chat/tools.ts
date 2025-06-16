import { z } from "zod";
import { tool } from "ai";
import { DateTime } from "luxon";
import Exa from "exa-js";
import MemoryClient from "mem0ai";
import dotenv from "dotenv";
dotenv.config();

const memoryClient = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

export const getCurrentTime = tool({
  description:
    "Returns the current UTC date and time in a structured format. Provides both separate date and time components as well as a combined ISO-like timestamp string. Useful for logging, timestamps, scheduling operations, or any functionality requiring current time information in a standardized format.",
  parameters: z.object({}),
  execute: async () => {
    const now = DateTime.now();
    const formattedDate = now.toFormat("yyyy-MM-dd");
    const formattedTime = now.toFormat("HH:mm");

    return {
      date: formattedDate,
      time: formattedTime,
      dateAndTime: `${formattedDate} ${formattedTime}`,
    };
  },
});

export const InteractWithGoogleSearch = tool({
  description:
    "Interacts with Google/internet search to get the latest information on a given topic if doesnt required. Useful for finding the most recent information on a topic, such as news, events, or trends.",
  parameters: z.object({
    query: z.string().describe("The query to search for."),
  }),
  execute: async ({ query }) => {
    const exa = new Exa("832f47c1-015c-4e47-8d29-ec5060882cec");

    const result = await exa.searchAndContents(query, {
      text: true,
      type: "neural",
      numResults: 5,
    });

    // Format the response to include sources information
    const formattedResult = {
      query: query,
      results: result.results.map((item: any) => ({
        title: item.title,
        url: item.url,
        text: item.text?.substring(0, 500) + "...", // Truncate for brevity
        publishedDate: item.publishedDate,
        author: item.author,
      })),
      sources: result.results.map((item: any) => ({
        id: item.id || item.url,
        url: item.url,
        title: item.title,
        sourceType: "url" as const,
        favicon: item.favicon,
      })),
    };

    return formattedResult;
  },
});

export const addToMemory = tool({
  description:
    "Adds a message to the memory of the user related to name, age, behavior, preferences or any other information that is relevant to the user. Useful for adding a message to the memory of the user.",
  parameters: z.object({
    memory: z.string().describe("The memory to add."),
    userID: z.string().describe("The user who is adding the message."),
  }),

  execute: async ({ memory, userID }) => {
    memoryClient.add([{ role: "user", content: memory }], {
      user_id: userID,
    });
    console.log("Memory added");
    return true;
  },
});
