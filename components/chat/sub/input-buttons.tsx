import { useCallback, useRef } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useAtom } from "jotai";
import { searchAtom } from "@/atoms/searchState";
import { addToast } from "@heroui/toast";

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
    addToast({
      title: "Perplexity Search is now " + (search ? "OFF" : "ON"),
      description: "You can now search the web with Perplexity",
      color: search ? "warning" : "success",
      timeout: 1000,
    });
  }, [search, setSearch]);

  return (
    <div className="flex w-full flex-row items-center justify-between px-3 pb-3">
      <Tooltip showArrow content="Attach Files">
        <Button
          isIconOnly
          className="p-1.5"
          radius="md"
          size="sm"
          variant="flat"
          onPress={() => fileInputRef.current?.click()}
        >
          <Icon
            className="text-default-700"
            icon="solar:paperclip-outline"
            width={18}
          />
          <VisuallyHidden>
            <input
              ref={fileInputRef}
              multiple
              accept="image/*"
              type="file"
              onChange={handleFileUpload}
            />
          </VisuallyHidden>
        </Button>
      </Tooltip>

      <div className="flex flex-row items-center gap-2">
        <Tooltip
          content={
            search ? "Perplexity Search [ON]" : "Perplexity Search [OFF]"
          }
        >
          <Button
            className={`${search ? "bg-neutral-200 px-5 text-neutral-950" : "border border-neutral-800 bg-neutral-900 px-5 text-white"}`}
            radius="md"
            size="sm"
            onPress={handleSearch}
            variant="flat"
          >
            Search
          </Button>
        </Tooltip>
        {(status === "streaming" || status === "submitted") && (
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
        )}
        {status !== "streaming" && status !== "submitted" && (
          <Button
            isIconOnly
            className={!prompt ? "bg-neutral-800" : "bg-neutral-200"}
            isDisabled={!prompt}
            radius="md"
            size="sm"
            type="submit"
            variant="flat"
          >
            <Icon
              className={!prompt ? "text-white" : "text-neutral-950"}
              icon="solar:arrow-up-linear"
              width={20}
            />
          </Button>
        )}
      </div>
    </div>
  );
}
