"use client";

import { useCallback, useRef } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useAtom } from "jotai";

// Removed @vercel/blob/client import since we're using custom API route

import { searchAtom } from "@/atoms/searchState";

export default function InputButtons({
  setAssets,
  prompt,
  stop,
  status,
}: {
  prompt: string;
  setAssets: React.Dispatch<React.SetStateAction<string[]>>;
  stop: () => void;
  status: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useAtom(searchAtom);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = () => {
            const base64data = reader.result as string;

            setAssets((prev) => [...prev, base64data]);
          };
          reader.readAsDataURL(file);
        }
      });

      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const handleSearch = useCallback(() => {
    setSearch(!search);
  }, [search, setSearch]);

  return (
    <div className="flex w-full flex-row items-center justify-between px-3 pb-3">
      <div className="flex flex-row items-center gap-2">
        <Tooltip closeDelay={0} content="Attach Files" delay={0}>
          <Button
            isIconOnly
            className="border border-default-200 bg-default-100 p-1.5 text-default-800"
            radius="md"
            size="sm"
            onPress={() => fileInputRef.current?.click()}
          >
            <Icon
              className="text-default-900"
              icon="solar:paperclip-outline"
              width={18}
            />
            <VisuallyHidden>
              <input
                ref={fileInputRef}
                multiple
                accept="image/jpeg,image/png,application/pdf,text/csv"
                type="file"
                onChange={handleFileUpload}
              />
            </VisuallyHidden>
          </Button>
        </Tooltip>
        <Tooltip
          closeDelay={0}
          content={search ? "Turn off Web Search" : "Turn on Web Search"}
          delay={0}
        >
          <Button
            className={`${search ? "bg-neutral-200 px-5 text-neutral-950" : "border border-default-200 bg-default-100 px-5 text-white"}`}
            radius="md"
            size="sm"
            onPress={handleSearch}
          >
            Web Search
          </Button>
        </Tooltip>
      </div>

      <div className="flex flex-row items-center gap-2">
        {(status === "streaming" || status === "submitted") && (
          <Tooltip closeDelay={0} content="Stop Streaming" delay={0}>
            <Button
              isIconOnly
              className="bg-neutral-300 p-1.5 text-neutral-900"
              radius="md"
              size="sm"
              variant="flat"
              onPress={handleStop}
            >
              <Icon icon="qlementine-icons:stop-24" width={18} />
            </Button>
          </Tooltip>
        )}
        {status !== "streaming" && status !== "submitted" && (
          <Tooltip closeDelay={0} content="Send Message" delay={0}>
            <Button
              isIconOnly
              className={
                !prompt
                  ? "border border-default-200 bg-default-100"
                  : "bg-neutral-200"
              }
              isDisabled={!prompt}
              radius="md"
              size="sm"
              type="submit"
            >
              <Icon
                className={!prompt ? "text-white" : "text-neutral-950"}
                icon="solar:arrow-up-linear"
                width={20}
              />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
