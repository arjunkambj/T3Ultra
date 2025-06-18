"use client";

import React from "react";

import { PromptInputFullLineComponent } from "./sub/InputPrompt";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isnewchat: boolean;
  isLoading: boolean;
  stop: () => void;
  status: string;
}

export default function ChatInput({
  input,
  handleInputChange,
  onSubmit,
  handleKeyDown,
  stop,
  status,
}: ChatInputProps) {
  return (
    <div className="w-full">
      <PromptInputFullLineComponent
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        input={input}
        status={status}
        stop={stop}
        onSubmit={onSubmit}
      />
    </div>
  );
}
