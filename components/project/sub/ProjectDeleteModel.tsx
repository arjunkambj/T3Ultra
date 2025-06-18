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
import { useMutation } from "convex/react";
import { memo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default memo(function ProjectDeleteModel({
  id,
}: {
  id: Id<"projects">;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const deleteProject = useMutation(api.function.project.deleteProject);

  const handleDeleteProject = () => {
    deleteProject({ _id: id });
    onClose();
  };

  return (
    <>
      <Button
        isIconOnly
        className="bg-neutral-800 text-sm text-danger hover:bg-danger hover:text-white"
        size="sm"
        variant="flat"
        onPress={onOpen}
      >
        <Icon icon="mdi:delete" width={20} />
      </Button>
      <Modal
        backdrop="transparent"
        className="h-auto max-w-xl"
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
                      Delete Project
                    </h2>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4 pb-1 pt-1">
                <p className="text-neutral-400">
                  Are you sure you want to delete this project?
                </p>
              </ModalBody>
              <ModalFooter className="my-2 flex flex-col gap-2">
                <Button
                  className="bg-danger text-white hover:bg-danger/80"
                  onPress={handleDeleteProject}
                >
                  Delete Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
