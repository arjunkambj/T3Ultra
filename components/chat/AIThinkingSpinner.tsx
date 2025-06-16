"use client";

import { motion } from "motion/react";
import Lottie from "lottie-react";

import spinner from "@/public/spinner.json";

export default function AIThinkingSpinner({
  status,
  messages,
}: {
  status: "submitted" | "streaming" | "ready" | "error";
  messages?: any[];
}) {
  const isSearchingInternet =
    messages && messages.length > 0
      ? (() => {
          const lastMessage = messages[messages.length - 1];

          if (lastMessage?.role === "assistant" && lastMessage?.parts) {
            return lastMessage.parts.some(
              (part: any) =>
                part.type === "tool-invocation" &&
                (part.toolInvocation?.state === "call" ||
                  part.toolInvocation?.state === "partial-call") &&
                part.toolInvocation?.toolName === "googleSearch",
            );
          }

          return false;
        })()
      : false;

  // Check if the last message is from assistant and has actual text content
  const hasAssistantTextResponse =
    messages && messages.length > 0
      ? (() => {
          const lastMessage = messages[messages.length - 1];

          if (lastMessage?.role === "assistant") {
            // Check if there's any text content in the message
            if (lastMessage.content && lastMessage.content.trim().length > 0) {
              return true;
            }
            // Check if there are text parts
            if (lastMessage.parts) {
              return lastMessage.parts.some(
                (part: any) =>
                  part.type === "text" &&
                  part.text &&
                  part.text.trim().length > 0,
              );
            }
          }

          return false;
        })()
      : false;

  const shouldShowSpinner =
    status === "submitted" ||
    isSearchingInternet ||
    (status === "streaming" && !hasAssistantTextResponse) ||
    (status !== "ready" &&
      status !== "error" &&
      status !== "streaming" &&
      !hasAssistantTextResponse);

  // What message to show on UI
  const getStatusMessage = () => {
    if (isSearchingInternet) {
      return "Searching the internet...";
    }

    return "AI is thinking...";
  };

  return (
    shouldShowSpinner && (
      <div className="flex justify-start">
        <div className="flex items-center gap-2 rounded-lg px-4 py-2">
          <Lottie
            animationData={spinner}
            autoplay={true}
            loop={true}
            style={{ width: 24, height: 24 }}
          />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative text-sm"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {getStatusMessage()
              .split("")
              .map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  animate={{
                    color: [
                      "rgb(113 113 122)",
                      "rgb(255 255 255)",
                      "rgb(113 113 122)",
                    ],
                  }}
                  className="relative inline-block"
                  initial={{ color: "rgb(113 113 122)" }} //
                  style={{
                    minWidth: char === " " ? "0.25em" : "auto",
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
          </motion.div>
        </div>
      </div>
    )
  );
}
