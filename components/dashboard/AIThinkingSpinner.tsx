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
  const getActiveToolInfo = () => {
    if (!messages || messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "assistant" && lastMessage?.parts) {
      // Check for active tool calls
      const activeTool = lastMessage.parts.find(
        (part: any) =>
          part.type === "tool-invocation" &&
          (part.toolInvocation?.state === "call" ||
            part.toolInvocation?.state === "partial-call"),
      );

      if (activeTool) {
        return {
          toolName: activeTool.toolInvocation?.toolName,
          isActive: true,
        };
      }

      // Check if we have tool calls but no text response yet
      const hasToolCalls = lastMessage.parts.some(
        (part: any) => part.type === "tool-invocation",
      );

      const hasTextResponse = lastMessage.parts.some(
        (part: any) => part.type === "text" && part.text?.trim().length > 0,
      );

      if (hasToolCalls && !hasTextResponse) {
        return {
          toolName: "processing",
          isActive: true,
        };
      }
    }

    // Check for toolInvocations (alternative structure)
    if (lastMessage?.role === "assistant" && lastMessage?.toolInvocations) {
      const activeTool = lastMessage.toolInvocations.find(
        (tool: any) => tool.state === "call" || tool.state === "partial-call",
      );

      if (activeTool) {
        return {
          toolName: activeTool.toolName,
          isActive: true,
        };
      }
    }

    return null;
  };

  const activeToolInfo = getActiveToolInfo();
  const isUsingTool = activeToolInfo?.isActive || false;
  const isSearchingInternet = activeToolInfo?.toolName === "internetSearch";
  const isAddingMemory = activeToolInfo?.toolName === "addToMemory";
  const isGettingTime = activeToolInfo?.toolName === "getCurrentTime";
  const isProcessingTools = activeToolInfo?.toolName === "processing";

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
    isUsingTool ||
    (status === "streaming" && (!hasAssistantTextResponse || isUsingTool)) ||
    (status !== "ready" && status !== "error" && !hasAssistantTextResponse);

  // What message to show on UI
  const getStatusMessage = () => {
    if (isSearchingInternet) {
      return "Searching the internet...";
    }

    if (isAddingMemory) {
      return "Saving to memory...";
    }

    if (isGettingTime) {
      return "Getting current time...";
    }

    if (isProcessingTools) {
      return "Processing tools...";
    }

    if (isUsingTool) {
      return "Using tools...";
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
                  key={index}
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
                    duration: 0.4,
                    delay: index * 0.03,
                    repeat: Infinity,
                    repeatDelay: 0.1,
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
