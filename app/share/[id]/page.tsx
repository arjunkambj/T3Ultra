"use client";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useParams } from "next/navigation";

export default function SharePage() {
  const { id } = useParams();

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
          onPress={handleCopyLink}
          variant="flat"
        >
          Copy Link
        </Button>
        <h1 className="text-3xl font-bold text-neutral-300">SharePage</h1>
      </div>
    </div>
  );
}
