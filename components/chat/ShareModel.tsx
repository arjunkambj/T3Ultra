"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const expirationOptions = [
  { key: "1d", label: "1 Day", description: "Expires in 24 hours" },
  { key: "2d", label: "2 Days", description: "Expires in 48 hours" },
  { key: "7d", label: "7 Days", description: "Expires in 1 week" },
  { key: "never", label: "Never", description: "Never expires" },
];

export default function ShareModel({ chatId }: { chatId: string }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const user = useUser();

  const [selectedExpiration, setSelectedExpiration] = useState<
    "1d" | "2d" | "7d" | "never"
  >("1d");
  const [isLoading, setIsLoading] = useState(false);
  const createShare = useMutation(api.function.share.createShareChat);

  if (!user) {
    return null;
  }

  const shareId = uuidv4();
  const shareLink = `http://localhost:3000/share/${shareId}`;

  const handleShare = async () => {
    try {
      setIsLoading(true);

      await createShare({
        chatId,
        userId: user._id,
        expiresAt: selectedExpiration,
        shareId,
      });

      await navigator.clipboard.writeText(shareLink);

      addToast({
        title: "Copied to clipboard",
        description: "Share link copied to clipboard",
        color: "success",
      });

      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to share chat. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="absolute right-4 top-2 z-20 justify-start text-default-800 hover:text-default-900"
        startContent={<Icon icon="solar:share-linear" width={20} />}
        variant="light"
        onPress={onOpen}
      >
        Share Chat
      </Button>
      <Modal
        backdrop="transparent"
        className="max-w-xl shadow-none"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">
                <div className="relative flex flex-col space-y-3">
                  <div>
                    <h2 className="text-3xl font-semibold text-white">
                      Share Chat
                    </h2>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-default-700">
                      Expiration
                    </label>
                    <div className="flex max-w-sm gap-2">
                      {expirationOptions.map((option) => (
                        <Button
                          key={option.key}
                          variant={
                            selectedExpiration === option.key
                              ? "solid"
                              : "bordered"
                          }
                          color={
                            selectedExpiration === option.key
                              ? "primary"
                              : "default"
                          }
                          className="h-12 flex-1"
                          onPress={() =>
                            setSelectedExpiration(
                              option.key as "1d" | "2d" | "7d" | "never",
                            )
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Input value={shareLink} label="Share Link" isReadOnly />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={handleShare}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Sharing..." : "Share"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
