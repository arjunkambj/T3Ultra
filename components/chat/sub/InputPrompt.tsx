"use client";

import { Icon } from "@iconify/react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { Message } from "ai";

import InputButtons from "./input-buttons";
import PromptInput from "./prompt-input";

interface PromptInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  stop: () => void;
  status: string;
  append: (message: Message) => void;
}

interface PromptInputAssetsProps {
  assets: string[];
  onRemoveAsset: (index: number) => void;
}

const PromptInputAssets = ({
  assets,
  onRemoveAsset,
}: PromptInputAssetsProps) => {
  if (assets.length === 0) return null;

  return (
    <>
      {assets.map((asset, index) => (
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
              onPress={() => onRemoveAsset(index)}
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
            src={asset}
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
  const [assets, setAssets] = useState<string[]>([]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();

          if (!blob) continue;

          try {
            // Upload the pasted image using the same logic as input-buttons
            const formData = new FormData();

            formData.append("file", blob, `pasted-image-${Date.now()}.png`);

            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();

              throw new Error(errorData.error || "Upload failed");
            }

            const result = await response.json();

            setAssets((prev) => [...prev, result.url]);

            addToast({
              title: "Image pasted and uploaded successfully",
              color: "success",
              variant: "solid",
              timeout: 2000,
            });
          } catch (error) {
            void error;
            addToast({
              title: "Error uploading pasted image",
              description: "Please try again",
              color: "danger",
              variant: "solid",
              timeout: 2000,
            });
          }
        }
      }
    },
    [setAssets],
  );

  return (
    <Form
      className="dark:bg[#141415] flex w-full max-w-3xl flex-col items-start gap-0 rounded-2xl border border-neutral-300/20 bg-[#141415]"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      <div
        className={cn(
          "group flex gap-2 pl-[20px] pr-3",
          assets.length > 0 ? "pt-4" : "",
        )}
      >
        <PromptInputAssets
          assets={assets}
          onRemoveAsset={(index) => {
            setAssets((prev) => prev.filter((_, i) => i !== index));
          }}
        />
      </div>
      <PromptInput
        ref={inputRef}
        classNames={{
          innerWrapper: "relative",
          input: "text-medium h-auto w-full",
          inputWrapper:
            "!bg-transparent shadow-none group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 pr-3 pl-[20px] pt-4 pb-0",
        }}
        maxRows={16}
        minRows={2}
        name="content"
        radius="lg"
        value={input}
        variant="flat"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
      <InputButtons
        prompt={input}
        setAssets={setAssets}
        status={status}
        stop={stop}
      />
    </Form>
  );
}
