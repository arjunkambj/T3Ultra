"use client";

import React, { useState } from "react";

import { PromptInputFullLineComponent } from "./sub/InputPrompt";

interface ChatInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  stop: () => void;
  status: any;
}

export default function ChatInput({
  handleSubmit,
  prompt,
  setPrompt,
  stop,
  status,
}: ChatInputProps) {
  return (
    <div className="w-full">
      <PromptInputFullLineComponent
        handleSubmit={handleSubmit}
        prompt={prompt}
        setPrompt={setPrompt}
        stop={stop}
        status={status}
      />
    </div>
  );
}
