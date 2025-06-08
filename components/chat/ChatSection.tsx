"use client";

import PromptInputFullLine from "./InputPrompt";
import MessageUI from "./MessageUI";

import { useAI } from "@/hooks/useAI";

export default function ChatSection() {
  const { messages, input, setInput, handleSubmit } = useAI();

  return (
    <div className="flex flex-col justify-center items-center w-full h-dvh gap-2">
      <MessageUI message={messages} />
      <div className="absolute bottom-6 w-full max-w-2xl mx-auto">
        <PromptInputFullLine
          handleSubmit={handleSubmit}
          prompt={input}
          setPrompt={setInput}
        />
      </div>
    </div>
  );
}
