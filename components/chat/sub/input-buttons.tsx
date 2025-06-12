import { useCallback, useRef } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@react-aria/visually-hidden";

export default function InputButtons({
  setAssets,
  prompt,
}: {
  prompt: string;
  setAssets: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    </div>
  );
}
