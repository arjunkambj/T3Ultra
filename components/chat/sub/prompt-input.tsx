"use client";

import type { TextAreaProps } from "@heroui/input";

import React from "react";
import { Textarea } from "@heroui/input";
import { cn } from "@heroui/theme";

const PromptInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ classNames = {}, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        aria-label="Prompt"
        className="min-h-[40px] text-sm"
        classNames={{
          ...classNames,
          label: cn("hidden", classNames?.label),
          input: cn("py-0 text-sm", classNames?.input),
        }}
        minRows={1}
        placeholder="Ask anything..."
        radius="lg"
        variant="bordered"
        {...props}
      />
    );
  },
);

export default PromptInput;

PromptInput.displayName = "PromptInput";
