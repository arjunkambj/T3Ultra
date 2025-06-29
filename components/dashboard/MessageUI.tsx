"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { motion } from "framer-motion";

import UserMessage from "./UserMessage";
import AssistanceMessage from "./AssistanceMessage";
import AIThinkingSpinner from "./AIThinkingSpinner";

import { useMessages } from "@/hooks/use-messages";

export default function MessageUI({
  messages,
  status,
  reload,
  chatId,
  isShared,
}: {
  messages: any[];
  status: "submitted" | "streaming" | "ready" | "error";
  reload: () => void;
  chatId: string;
  isShared: boolean;
}) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
  } = useMessages({
    chatId,
    status,
  });
  const [memory, setMemory] = useState<boolean>(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "assistant" && lastMessage.toolInvocations) {
      const memoryTool = lastMessage.toolInvocations.find(
        (tool: any) => tool.toolName === "addToMemory",
      );
      const hasMemory = !!memoryTool;

      // Show toast when memory changes from false to true
      if (!memory && hasMemory) {
        addToast({
          title: "Memory Saved",
          icon: <Icon icon="flowbite:brain-solid" width={16} />,
          color: "default",
          timeout: 2000,
        });
      }
      setMemory(hasMemory);
    }
  }, [messages, memory]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex h-full w-full max-w-3xl flex-col px-3 pt-16"
    >
      {messages?.map((message) => (
        <div key={isShared ? message._id : message.id} className="pb-12">
          {message.role === "user" ? (
            <div className="flex w-full justify-end">
              <UserMessage
                isShared={isShared}
                message={message}
                messageId={message.id}
                reload={reload}
              />
            </div>
          ) : message.content.length > 0 ? (
            <AssistanceMessage
              allmessages={messages}
              chatId={chatId}
              isShared={isShared}
              message={message}
            />
          ) : null}
        </div>
      ))}
      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <AIThinkingSpinner messages={messages} status={status} />
        )}
      <motion.div
        ref={messagesEndRef}
        className="min-h-[24px] min-w-[24px] shrink-0"
        onViewportEnter={onViewportEnter}
        onViewportLeave={onViewportLeave}
      />
    </div>
  );
}
