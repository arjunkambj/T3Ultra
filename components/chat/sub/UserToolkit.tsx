"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";
import { useAtom } from "jotai";
import { editMessage } from "@/atoms/editMessage";
import { addToast } from "@heroui/toast";

export default function UserToolkit({
  message,
  edit,
  setEdit,
  reload,
}: {
  message: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  reload: () => void;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    addToast({
      color: "success",
      description: "Copied to clipboard",
      title: "Copied to clipboard",
    });
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Tooltip content="Copy">
        <Button
          isIconOnly
          onPress={handleCopy}
          radius="md"
          size="sm"
          variant="flat"
        >
          <Icon icon="solar:copy-outline" width={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Edit">
        <Button
          isIconOnly
          onPress={handleEdit}
          radius="md"
          size="sm"
          variant="flat"
        >
          <Icon icon="solar:edit-outline" width={18} />
        </Button>
      </Tooltip>
      <Tooltip content="Retry">
        <Button
          isIconOnly
          onPress={reload}
          radius="md"
          size="sm"
          variant="flat"
        >
          <Icon icon="solar:retry-outline" width={18} />
        </Button>
      </Tooltip>
    </div>
  );
}
