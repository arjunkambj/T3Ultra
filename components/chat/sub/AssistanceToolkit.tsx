"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";
import { v4 as uuidv4 } from "uuid";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { Id } from "@/convex/_generated/dataModel";

export default function AssistanceToolkit({
  message,
  chatId,
  isShared,
}: {
  message: any; // Full message object with id, content, role, etc.
  allmessages: any[];
  chatId: string;
  isShared: boolean;
}) {
  const router = useRouter();
  const createBranchChat = useMutation(api.function.branch.createBranchChat);
  const user = useUser();

  if (!user) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    addToast({
      color: "success",
      description: "Copied to clipboard",
      title: "Copied to clipboard",
    });
  };

  const handleBranchChat = async (message: any) => {
    if (!user) {
      return;
    }

    try {
      const newChatId = uuidv4();

      await createBranchChat({
        messageId: message.id as Id<"messages">,
        originalChatId: chatId,
        newChatId: newChatId,
      });

      addToast({
        color: "success",
        description: "Branch chat created successfully",
        title: "Branch Created",
      });

      router.push(`/chat/${newChatId}`);
    } catch (error) {
      void error;
      addToast({
        color: "danger",
        description: "Failed to create branch chat",
        title: "Branch Error",
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-0">
      <Tooltip content="Copy">
        <Button
          isIconOnly
          radius="md"
          size="sm"
          variant="flat"
          onPress={handleCopy}
        >
          <Icon icon="solar:copy-outline" width={18} />
        </Button>
      </Tooltip>

      {!isShared && (
        <Tooltip content="Branch Chat">
          <Button
            isIconOnly
            radius="md"
            size="sm"
            variant="flat"
            onPress={() => handleBranchChat(message)}
          >
            <Icon icon="f7:arrow-branch" width={18} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
