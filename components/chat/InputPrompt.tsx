"use client";

import { Icon } from "@iconify/react";
import React, { useCallback, useState } from "react";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { Tooltip } from "@heroui/tooltip";
import { VisuallyHidden } from "@react-aria/visually-hidden";

import PromptInput from "./sub/prompt-input";
import UploadFiles from "./sub/upload-files";

interface PromptInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  stop: () => void;
  status: any;
}

interface PromptInputAssetsProps {
  assets: string[];
  onRemoveAsset: (index: number) => void;
}

export default function PromptInputFullLine({
  prompt,
  setPrompt,
  handleSubmit,
  stop,
  status,
}: PromptInputProps) {
  return (
    <PromptInputFullLineComponent
      handleSubmit={handleSubmit}
      prompt={prompt}
      setPrompt={setPrompt}
      stop={stop}
      status={status}
    />
  );
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
  prompt,
  setPrompt,
  handleSubmit,
  status,
  stop,
}: PromptInputProps) {
  const [assets, setAssets] = useState<string[]>([]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();

        if (!blob) continue;

        const reader = new FileReader();

        reader.onload = () => {
          const base64data = reader.result as string;

          setAssets((prev) => [...prev, base64data]);
        };
        reader.readAsDataURL(blob);
      }
    }
  }, []);

  return (
    <Form
      className="flex w-full flex-col items-start gap-0  rounded-2xl bg-[#141415] border border-neutral-300/20 dark:bg[#141415]"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      <div
        className={cn(
          "group flex gap-2 pl-[20px] pr-3",
          assets.length > 0 ? "pt-4" : ""
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
        value={prompt}
        variant="flat"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onValueChange={setPrompt}
      />
      <UploadFiles prompt={prompt} setAssets={setAssets} />
    </Form>
  );
}
