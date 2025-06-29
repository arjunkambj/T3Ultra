"use client";

import { Icon } from "@iconify/react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { useAtom } from "jotai";

import PromptInput from "./prompt-input";
import InputButtons from "./input-buttons";

import { attachmentAtom } from "@/atoms/attachment";
interface PromptInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  stop: () => void;
  status: string;
}

interface PromptInputAssetsProps {
  isLoading: boolean;
}

const PromptInputAssets = ({ isLoading }: PromptInputAssetsProps) => {
  const [attachments, setAttachments] = useAtom(attachmentAtom);

  const handleRemoveAsset = useCallback(
    (index: number) => {
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    },
    [setAttachments],
  );

  if (attachments.length < 1) return null;

  return (
    <>
      {attachments.map((attachment, index) => (
        <Badge
          key={index}
          isOneChar
          className="opacity-0 group-hover:opacity-100"
          content={
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => handleRemoveAsset(index)}
            >
              <Icon
                className="text-foreground"
                icon="iconamoon:close-thin"
                width={16}
              />
            </Button>
          }
        >
          <Image
            alt="uploaded image"
            className="h-14 w-14 rounded-small border-small border-default-200/50 object-cover"
            src={attachment.url}
          />
        </Badge>
      ))}
    </>
  );
};

export function PromptInputFullLineComponent({
  input,
  handleInputChange,
  onSubmit,
  handleKeyDown,
  stop,
  status,
}: PromptInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [attachments] = useAtom(attachmentAtom);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [attachments]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();

          if (!blob) continue;

          const reader = new FileReader();

          reader.readAsDataURL(blob);
        }
      }
    },
    [attachments],
  );

  return (
    <Form
      className="flex w-full flex-col items-start gap-0 rounded-2xl border-1 border-default-100 bg-default-50"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      <div
        className={cn(
          "group relative flex gap-2 rounded-2xl pl-[20px] pr-3",
          attachments.length > 0 ? "pt-4" : "",
        )}
      >
        <PromptInputAssets isLoading={isLoading} />
      </div>
      <PromptInput
        ref={inputRef}
        classNames={{
          innerWrapper: "relative",
          input: "text-medium h-auto w-full",
          inputWrapper:
            "!bg-transparent shadow-none group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 pr-3 pl-[20px] pt-4 pb-0 ",
        }}
        maxRows={16}
        minRows={2}
        name="content"
        spellCheck={false as any}
        value={input}
        variant="flat"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
      <InputButtons
        prompt={input}
        setIsLoading={setIsLoading}
        status={status}
        stop={stop}
      />
    </Form>
  );
}

export default function PromptInputFullLine({
  input,

  onSubmit,
  handleInputChange,
  handleKeyDown,
  stop,
  status,
}: PromptInputProps) {
  return (
    <PromptInputFullLineComponent
      handleInputChange={handleInputChange}
      handleKeyDown={handleKeyDown}
      input={input}
      status={status}
      stop={stop}
      onSubmit={onSubmit}
    />
  );
}
