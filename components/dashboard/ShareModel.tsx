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
import { useState, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";

import { useUser } from "@/hooks/useUser";
import { api } from "@/convex/_generated/api";

const expirationOptions = [
  { key: "1d", label: "1 Day" },
  { key: "2d", label: "2 Days" },
  { key: "7d", label: "7 Days" },
  { key: "never", label: "Never" },
];

const ShareModel = memo(function ShareModel({ chatId }: { chatId: string }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const user = useUser();

  const [selectedExpiration, setSelectedExpiration] = useState<
    "1d" | "2d" | "7d" | "never"
  >("1d");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const createShare = useMutation(api.function.share.createShareChat);

  if (!user) {
    return null;
  }

  const shareId = uuidv4();
  const shareLink = `${process.env.NEXT_PUBLIC_URL}/share/${shareId}`;

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
        timeout: 2000,
      });

      onClose();
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Failed to share chat. Please try again.",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
  };

  return (
    <>
      <Button
        className="absolute right-12 top-2 z-20 justify-start text-default-800 hover:text-default-900"
        startContent={<Icon icon="solar:share-linear" width={20} />}
        variant="light"
        onPress={onOpen}
      >
        Share Chat
      </Button>
      <Modal
        backdrop="blur"
        className="max-w-lg shadow-none"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4 pt-5">
                <div className="relative flex flex-col space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Share Chat
                    </h2>
                    <p className="mt-2 text-sm text-default-500">
                      Create a shareable link for this conversation
                    </p>
                  </div>
                </div>
                <Divider className="mb-1 mt-4" />
              </ModalHeader>
              <ModalBody className="pb-1 pt-1">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-medium text-default-700"
                      htmlFor="expiration"
                    >
                      Expiration
                    </label>
                    <RadioGroup
                      className="gap-2"
                      defaultValue="1d"
                      orientation="horizontal"
                      value={selectedExpiration}
                      onValueChange={(value) => {
                        setSelectedExpiration(
                          value as "1d" | "2d" | "7d" | "never",
                        );
                      }}
                    >
                      {expirationOptions.map((option) => (
                        <Radio key={option.key} value={option.key}>
                          {option.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-medium text-default-700"
                      htmlFor="share-link"
                    >
                      Share Link
                    </label>
                    <div className="flex h-10 w-full gap-2">
                      <Input isReadOnly value={shareLink} />
                      <Button
                        isIconOnly
                        className="h-10 w-12 bg-default-100 text-default-700 hover:text-default-900"
                        size="sm"
                        variant="flat"
                        onPress={handleCopyLink}
                      >
                        {isCopied ? (
                          <Icon icon="tabler:copy-off" width={20} />
                        ) : (
                          <Icon icon="solar:copy-linear" width={20} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="my-2 flex flex-col gap-2">
                <div className="flex justify-end gap-2">
                  <Button
                    color="primary"
                    disabled={isLoading}
                    isLoading={isLoading}
                    startContent={<Icon icon="solar:share-bold" width={16} />}
                    onPress={handleShare}
                  >
                    {isLoading ? "Creating Link..." : "Share Chat"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default ShareModel;
