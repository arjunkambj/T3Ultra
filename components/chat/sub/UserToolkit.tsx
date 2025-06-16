"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";

import { addToast } from "@heroui/toast";
import { useUser } from "@/hooks/useUser";

export default function UserToolkit({
  message,
  edit,
  setEdit,
  reload,
  isShared,
}: {
  message: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  reload: () => void;
  isShared: boolean;
}) {
  const user = useUser();

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    addToast({
      color: "success",
      description: "Copied to clipboard",
      title: "Copied to clipboard",
    });
  };

  const handleEdit = () => {
    if (!user) {
      return;
    }

    setEdit(!edit);
  };

  return (
    <div className="flex flex-row items-center gap-0">
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
      {!isShared && (
        <Tooltip content="Edit">
          <Button
            isIconOnly
            onPress={handleEdit}
            radius="md"
            size="sm"
            variant="flat"
          >
            <Icon icon="tabler:edit" width={22} />
          </Button>
        </Tooltip>
      )}

      {!isShared && (
        <Tooltip content="Retry">
          <Button
            isIconOnly
            onPress={reload}
            radius="md"
            size="sm"
            variant="flat"
          >
            <Icon icon="pajamas:retry" width={18} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
