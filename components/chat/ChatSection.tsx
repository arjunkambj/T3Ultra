"use client";
import MessageUI from "./MessageUI";
import ChatInput from "./ChatInput";

import { useAI } from "@/hooks/useAI";
import { cn } from "@heroui/theme";
import ChatSuggestions from "./sub/chat-suggestion";

export default function ChatSection() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    experimental_resume,
    stop,
  } = useAI();

  const noInput = input.length && messages.length === 0 ? true : false;
  console.log(noInput);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-dvh",
        noInput ? "" : ""
      )}
    >
      {noInput ? (
        <div className="flex flex-col w-full items-center justify-start h-[calc(100dvh-160px)] px-3  overflow-y-auto">
          <MessageUI message={messages} status={status} />
        </div>
      ) : (
        <div className="flex flex-col pb-24 items-center max-w-2xl justify-center px-4 md:px-2 w-full">
          <ChatSuggestions setPrompt={setInput} />
        </div>
      )}
      <div className="absolute z-50 bottom-8 w-full max-w-3xl px-3">
        <ChatInput
          handleSubmit={handleSubmit}
          prompt={input}
          setPrompt={setInput}
          stop={stop}
          status={status}
        />
      </div>
    </div>
  );
}
