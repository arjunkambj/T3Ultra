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

  const models = {
    1: "GPT-4o Mini",
    2: "GPT-4.1 Mini",
    3: "GPT-4.1",
    4: "Gemini 2.0 Flash",
    5: "Gemini 2.5 Flash",
    6: "Grook 3 mini",
    7: "Grook 3.5",
  };

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
        color: "default",
        description: "Branch chat created successfully",
        title: "Branch Created",
        timeout: 1500,
      });

      router.push(`/chat/${newChatId}`);
    } catch (error) {
      void error;
      addToast({
        color: "danger",
        description: "Failed to create branch chat",
        title: "Branch Error",
        timeout: 1500,
      });
    }
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
          <Icon icon="solar:copy-linear" width={18} />
        </Button>
      </Tooltip>

      {!isShared && (
        <Tooltip
          showArrow
          closeDelay={0}
          content="Branch Chat"
          placement="bottom"
        >
          <Button
            isIconOnly
            className="bg-transparent p-0 text-neutral-300"
            radius="md"
            size="sm"
            onPress={() => handleBranchChat(message)}
          >
            <Icon icon="f7:arrow-branch" width={18} />
          </Button>
        </Tooltip>
      )}

      {message.modelUsed !== undefined ? (
        <div className="rounded-md bg-default-100 px-2 py-1 text-xs text-neutral-300">
          {models[parseInt(message.modelUsed) as keyof typeof models]}
        </div>
      ) : null}
    </div>
  );
}
