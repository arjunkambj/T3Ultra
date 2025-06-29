"use client";

import * as React from "react";
import { Icon } from "@iconify/react/dist/offline";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Chip } from "@heroui/chip";
import { cn } from "@heroui/theme";
import { useMutation, useQuery } from "convex/react";
import { addToast } from "@heroui/toast";

import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";

interface MemorySettingCardProps {
  className?: string;
}

const memoryCategories = [
  { key: "personal", label: "Personal" },
  { key: "work", label: "Work" },
  { key: "preferences", label: "Preferences" },
  { key: "context", label: "Context" },
  { key: "other", label: "Other" },
];

const MemorySetting = React.forwardRef<HTMLDivElement, MemorySettingCardProps>(
  ({ className, ...props }, ref) => {
    const user = useUser();
    const [deletingMemoryId, setDeletingMemoryId] = React.useState<
      string | null
    >(null);

    const memories = useQuery(
      api.function.memory.getAllMemories,
      user?._id ? { userId: user._id } : "skip",
    );

    const deleteMemoryMutation = useMutation(api.function.memory.deleteMemory);

    const handleDeleteMemory = async (memoryId: string) => {
      setDeletingMemoryId(memoryId);
      try {
        await deleteMemoryMutation({ memoryId: memoryId as any });
        addToast({
          title: "Memory Deleted",
          description: "Your memory has been deleted successfully.",
          color: "success",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error deleting memory:", error);
        addToast({
          title: "Error",
          description: "Failed to delete memory. Please try again.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setDeletingMemoryId(null);
      }
    };

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        <div>
          <p className="text-base font-medium text-default-700">
            Your Memories
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            View your stored memories that help personalize AI responses. These
            are automatically created based on your conversations.
          </p>

          <Spacer y={4} />

          <div className="space-y-3">
            {memories && memories.length > 0 ? (
              memories.map((memory) => (
                <Card key={memory._id} className="bg-default-100" shadow="none">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-1 items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <Icon
                            className="text-default-400"
                            icon="mdi:brain"
                            width={16}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-default-600">
                            {memory.memory}
                          </p>
                          {memory.category && (
                            <Chip
                              className="mt-3"
                              color="primary"
                              size="sm"
                              variant="flat"
                            >
                              {memoryCategories.find(
                                (c) => c.key === memory.category,
                              )?.label || memory.category}
                            </Chip>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          isLoading={deletingMemoryId === memory._id}
                          onPress={() => handleDeleteMemory(memory._id)}
                          className="h-8 min-w-8"
                        >
                          <Icon className="h-4 w-4" icon="mdi:delete" />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="bg-default-100" shadow="none">
                <CardBody className="p-8 text-center">
                  <Icon
                    className="mx-auto mb-4 text-default-400"
                    icon="mdi:brain"
                    width={48}
                  />
                  <p className="mb-2 text-sm font-medium text-default-600">
                    No memories stored yet
                  </p>
                  <p className="mx-auto max-w-sm text-xs leading-relaxed text-default-400">
                    As you chat with the AI, it will automatically create
                    memories to better understand your preferences and provide
                    more personalized responses.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          {memories && memories.length > 0 && (
            <>
              <Spacer y={6} />
              <Card
                className="border border-default-200 bg-default-50"
                shadow="none"
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 flex-shrink-0 text-primary-500"
                      icon="mdi:information"
                      width={16}
                    />
                    <div>
                      <p className="mb-1 text-xs font-medium text-default-700">
                        About Memories
                      </p>
                      <p className="text-xs leading-relaxed text-default-500">
                        These memories are automatically created from your
                        conversations to help the AI provide more relevant and
                        personalized responses. They help maintain context
                        across different chat sessions.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  },
);

MemorySetting.displayName = "MemorySetting";

export default MemorySetting;
