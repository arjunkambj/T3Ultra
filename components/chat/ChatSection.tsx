"use client";
import { cn } from "@heroui/theme";
import { Spinner } from "@heroui/spinner";
import MessageUI from "./MessageUI";
import ChatInput from "./ChatInput";
import ChatSuggestions from "./sub/chat-suggestion";
import { useAI } from "@/hooks/useAI";
import LoginModel from "@/components/auth/LoginModel";
import ShareModel from "./ShareModel";

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
    experimental_resume,
    stop,
    reload,
  } = useAI({ isnewchat, chatId });

  const hasInput = input.length > 0 ? true : false;
  const hasMessages = messages.length > 0 ? true : false;

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );
  }

  return (
    <>
      {hasMessages && <ShareModel chatId={chatId} />}
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center",
          hasMessages ? "justify-start" : "",
        )}
      >
        {hasInput || hasMessages ? (
          <div className="flex h-[calc(100dvh-160px)] w-full flex-col items-center justify-center overflow-y-auto px-3">
            <MessageUI
              messages={messages}
              status={status}
              reload={reload}
              chatId={chatId}
              isShared={false}
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
              onSubmit={onSubmit}
              stop={stop}
              status={status}
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
