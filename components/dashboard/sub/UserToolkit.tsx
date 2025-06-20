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
      color: "default",
      description: "Copied to clipboard",
      title: "Copied to clipboard",
      timeout: 1500,
    });
  };

  const handleEdit = () => {
    if (!user) {
      return;
    }

    setEdit(!edit);
  };

  const handleRetry = () => {
    if (!user) {
      return;
    }
    reload();
  };

  return (
    <div className="flex flex-row items-center gap-0">
      <Tooltip showArrow closeDelay={0} content="Copy Text" placement="bottom">
        <Button
          isIconOnly
          className="bg-transparent p-0 text-neutral-300"
          radius="md"
          size="sm"
          onPress={handleCopy}
        >
          <Icon icon="mynaui:copy" width={18} />
        </Button>
      </Tooltip>
      {!isShared && (
        <Tooltip
          showArrow
          closeDelay={0}
          content="Edit & Send Again "
          placement="bottom"
        >
          <Button
            isIconOnly
            className="bg-transparent p-0 text-neutral-300"
            radius="md"
            size="sm"
            onPress={handleEdit}
          >
            <Icon icon="mynaui:edit" width={18} />
          </Button>
        </Tooltip>
      )}

      {!isShared && (
        <Tooltip
          showArrow
          closeDelay={0}
          content="Switch Model"
          placement="bottom"
        >
          <Button
            isIconOnly
            className="bg-transparent p-0 text-neutral-300"
            radius="md"
            size="sm"
            onPress={handleRetry}
          >
            <Icon icon="mynaui:refresh" width={18} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
