"use client";

import PromptInputFullLine from "./InputPrompt";
import MessageUI from "./MessageUI";

import { useAI } from "@/hooks/useAI";

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

  console.log(messages);

  return (
    <div className="flex flex-col  items-center w-full h-dvh gap-2">
      <div className="flex flex-col w-full items-center justify-start h-[calc(100dvh-160px)] overflow-y-auto">
        <MessageUI message={messages} status={status} />
      </div>
      <div className="absolute z-50 bottom-6 w-full max-w-3xl mx-auto">
        <PromptInputFullLine
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
