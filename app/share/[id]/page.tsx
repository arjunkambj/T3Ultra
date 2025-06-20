"use client";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";

import { api } from "@/convex/_generated/api";
import MessageUI from "@/components/dashboard/MessageUI";

export default function SharePage() {
  const { id } = useParams();

  const sharedMessages = useQuery(api.function.share.getSharedChatMessages, {
    chatId: id as string,
  });

  if (!sharedMessages) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center">
        <Spinner variant="dots" />
      </div>
    );
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/share/${id}`;

    navigator.clipboard.writeText(link);
    addToast({
      title: "Link copied to clipboard",
      description: "You can now share the link with your friends",
      color: "success",
    });
  };

  return (
    <div className="flex h-dvh w-full flex-col items-center bg-[#0A0A0A] pl-20 pr-2 pt-8">
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded border border-neutral-600 bg-[#0F0F10]">
        <Button
          className="absolute right-9 top-5 bg-neutral-800 text-neutral-100"
          variant="flat"
          onPress={handleCopyLink}
        >
          <Icon icon="solar:copy-bold" width={16} />
          <span className="text-sm">Copy Link</span>
        </Button>
        <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto">
          <MessageUI
            chatId={id as string}
            isShared={true}
            messages={sharedMessages}
            reload={() => {}}
            status="ready"
          />
        </div>
      </div>
    </div>
  );
}
