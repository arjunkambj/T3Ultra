import { useCallback, useRef } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";
import { VisuallyHidden } from "@react-aria/visually-hidden";

export default function UploadFiles({
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
    []
  );
  return (
    <div className="flex w-full flex-row items-center justify-between px-3 pb-3">
      <Tooltip showArrow content="Attach Files">
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          onPress={() => fileInputRef.current?.click()}
        >
          <Icon
            className="text-default-500"
            icon="solar:paperclip-outline"
            width={24}
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
        color={!prompt ? "default" : "primary"}
        isDisabled={!prompt}
        radius="full"
        size="sm"
        type="submit"
        variant="solid"
      >
        <Icon
          className={cn(
            "[&>path]:stroke-[2px]",
            !prompt ? "text-default-600" : "text-primary-foreground"
          )}
          icon="solar:arrow-up-linear"
          width={20}
        />
      </Button>
    </div>
  );
}
