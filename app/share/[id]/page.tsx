"use client";

import MessageUI from "@/components/chat/MessageUI";
import { api } from "@/convex/_generated/api";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";

export default function SharePage() {
  const { id } = useParams();

  const sharedMessages = useQuery(api.function.share.getSharedChatMessages, {
    chatId: id as string,
  });

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
          className="absolute right-5 top-5 text-neutral-100"
          variant="flat"
          onPress={handleCopyLink}
        >
          Copy Link
        </Button>
        <div className="flex h-full w-full flex-col items-center justify-center">
          {sharedMessages ? (
            <MessageUI
              messages={sharedMessages || []}
              status="ready"
              resume={() => {}}
              reload={() => {}}
              chatId={id as string}
              isShared={true}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
