import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";
import { memo, useRef } from "react";

interface CodeClipboardProps {
  code: string;
}

const CodeClipboardComponent = ({ code }: CodeClipboardProps) => {
  const codeRef = useRef(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeRef.current);
      addToast({
        title: "Copied to clipboard",
        color: "success",
      });
    } catch (error) {
      void error;
      addToast({
        title: "Failed to copy ",
        color: "danger",
      });
    }
  };

  // Update ref when code changes
  codeRef.current = code;

  return (
    <Button
      isIconOnly
      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      size="sm"
      variant="light"
      onPress={handleCopy}
    >
      <Icon icon="mdi:content-copy" />
    </Button>
  );
};

export const CodeClipboard = memo(CodeClipboardComponent);
