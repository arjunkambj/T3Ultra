"use client";

import UserMessage from "./UserMessage";
import AssistanceMessage from "./AssistanceMessage";
import AIThinkingSpinner from "./AIThinkingSpinner";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";

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
    <div className="flex h-full w-full max-w-3xl flex-col px-3 pt-16">
      {messages?.map((message) => (
        <div className="pb-12" key={isShared ? message.messageId : message.id}>
          {message.role === "user" ? (
            <div className="flex w-full justify-end">
              <UserMessage
                isShared={isShared}
                message={message.content}
                reload={reload}
              />
            </div>
          ) : (
            <AssistanceMessage
              isShared={isShared}
              message={message}
              allmessages={messages}
              chatId={chatId}
            />
          )}
        </div>
      ))}
      <AIThinkingSpinner messages={messages} status={status} />
    </div>
  );
}
