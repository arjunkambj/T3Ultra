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
import { Divider } from "@heroui/divider";
import { useState, memo } from "react";
import { Input, Textarea } from "@heroui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const ProjectCreateModel = memo(function ProjectCreateModel() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectInstructions, setProjectInstructions] = useState("");

  const createProject = useMutation(api.function.project.createProject);

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      await createProject({
        name: projectName,
        instructions: projectInstructions,
        description: projectDescription,
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
        startContent={<Icon icon="mdi:plus" width={20} />}
        onPress={onOpen}
      >
        Create Project
      </Button>
      <Modal
        backdrop="blur"
        className="h-auto max-w-xl shadow-none"
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
                      Create Project
                    </h2>
                  </div>
                </div>
                <Divider className="mb-1 mt-4" />
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4 pb-1 pt-1">
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Textarea
                  label="Project Description"
                  placeholder="Enter project description"
                  rows={1}
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
                <Textarea
                  label="Project Instructions"
                  placeholder="Enter project instructions"
                  rows={4}
                  required
                  value={projectInstructions}
                  onChange={(e) => setProjectInstructions(e.target.value)}
                />
              </ModalBody>
              <ModalFooter className="my-2 flex flex-col gap-2">
                <Button
                  className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  isLoading={isLoading}
                  onPress={handleCreateProject}
                  startContent={<Icon icon="mdi:folder-plus" width={16} />}
                >
                  Create Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default ProjectCreateModel;
