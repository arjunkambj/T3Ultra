import { z } from "zod";
import { tool } from "ai";
import { DateTime } from "luxon";

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
