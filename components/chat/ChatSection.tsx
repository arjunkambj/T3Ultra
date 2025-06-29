"use client";
import { cn } from "@heroui/theme";
import { Spinner } from "@heroui/spinner";

import MessageUI from "../dashboard/MessageUI";

import ChatInput from "./ChatInput";
import ChatSuggestions from "./ChatSuggestion";

import { useAI } from "@/hooks/useAI";
import LoginModel from "@/components/auth/LoginModel";

export default function ChatSection({
  chatId,
  isnewchat,
}: {
  chatId: string;
  isnewchat: boolean;
}) {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    onSubmit,
    handleKeyDown,
    status,
    isLoading,
    isLoginModalOpen,
    onLoginModalOpenChange,
    onLoginModalOpen,
    stop,
    reload,
  } = useAI({ isnewchat, chatId });

  const hasInput = input.length > 0 ? true : false;
  const hasMessages = messages.length > 0 ? true : false;

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner color="white" />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center",
          hasMessages ? "justify-start" : "",
        )}
      >
        {hasInput || hasMessages ? (
          <div className="flex h-[calc(100dvh-160px)] w-full flex-col items-center justify-center overflow-y-auto px-3">
            <MessageUI
              chatId={chatId}
              isShared={false}
              messages={messages}
              reload={reload}
              status={status}
            />
          </div>
        ) : (
          <div className="flex w-full max-w-2xl flex-col items-center justify-center px-4 pb-24 md:px-0">
            <ChatSuggestions setPrompt={setInput} />
          </div>
        )}
        <div className="absolute bottom-8 z-50 flex w-full flex-col items-center justify-center px-3">
          <div className="w-full max-w-3xl">
            <ChatInput
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              input={input}
              isLoading={isLoading}
              isnewchat={isnewchat}
              setInput={setInput}
              status={status}
              stop={stop}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
      <LoginModel
        isOpen={isLoginModalOpen}
        onOpen={onLoginModalOpen}
        onOpenChange={onLoginModalOpenChange}
      />
    </>
  );
}
