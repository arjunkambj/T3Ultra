"use client";

import * as React from "react";
import { Icon } from "@iconify/react/dist/offline";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
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
    const [newMemory, setNewMemory] = React.useState("");
    const [newCategory, setNewCategory] = React.useState("");
    const [editingMemory, setEditingMemory] = React.useState<{
      id: string;
      memory: string;
      category?: string;
    } | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const memories = useQuery(
      api.function.memory.getAllMemories,
      user?._id ? { userId: user._id } : "skip",
    );
    const addMemoryMutation = useMutation(api.function.memory.addMemory);
    const updateMemoryMutation = useMutation(api.function.memory.updateMemory);
    const deleteMemoryMutation = useMutation(api.function.memory.deleteMemory);

    const handleAddMemory = async () => {
      if (!user?._id || !newMemory.trim()) return;

      setIsLoading(true);
      try {
        await addMemoryMutation({
          userId: user._id,
          memory: newMemory.trim(),
          category: newCategory || undefined,
        });

        setNewMemory("");
        setNewCategory("");
        addToast({
          title: "Memory Added",
          description: "Your memory has been saved successfully.",
          color: "success",
          timeout: 3000,
        });
      } catch (error) {
        void error;
        addToast({
          title: "Error",
          description: "Failed to add memory. Please try again.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleUpdateMemory = async () => {
      if (!editingMemory || !editingMemory.memory.trim()) return;

      setIsLoading(true);
      try {
        await updateMemoryMutation({
          memoryId: editingMemory.id as any,
          memory: editingMemory.memory.trim(),
          category: editingMemory.category || undefined,
        });

        setEditingMemory(null);
        addToast({
          title: "Memory Updated",
          description: "Your memory has been updated successfully.",
          color: "success",
          timeout: 3000,
        });
      } catch (error) {
        void error;
        addToast({
          title: "Error",
          description: "Failed to update memory. Please try again.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteMemory = async (memoryId: string) => {
      setIsLoading(true);
      try {
        await deleteMemoryMutation({ memoryId: memoryId as any });
        addToast({
          title: "Memory Deleted",
          description: "Your memory has been deleted successfully.",
          color: "success",
          timeout: 3000,
        });
      } catch (error) {
        void error;
        addToast({
          title: "Error",
          description: "Failed to delete memory. Please try again.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Add New Memory */}
        <div>
          <p className="text-base font-medium text-default-700">Add Memory</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Store important information for the AI to remember across
            conversations.
          </p>

          <div className="mt-4 space-y-4">
            <Textarea
              classNames={{
                input: cn("min-h-[100px]"),
              }}
              placeholder="e.g., I prefer concise explanations, I work as a software developer, I'm learning React..."
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
            />

            <div className="flex gap-2">
              <Select
                className="max-w-[200px]"
                placeholder="Select category"
                selectedKeys={newCategory ? [newCategory] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;

                  setNewCategory(selectedKey || "");
                }}
              >
                {memoryCategories.map((category) => (
                  <SelectItem key={category.key}>{category.label}</SelectItem>
                ))}
              </Select>

              <Button
                color="primary"
                isDisabled={!newMemory.trim()}
                isLoading={isLoading}
                size="md"
                onPress={handleAddMemory}
              >
                Add Memory
              </Button>
            </div>
          </div>
        </div>

        <Spacer y={6} />

        {/* Existing Memories */}
        <div>
          <p className="text-base font-medium text-default-700">
            Your Memories
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Manage your stored memories that help personalize AI responses.
          </p>

          <div className="mt-4 space-y-3">
            {memories && memories.length > 0 ? (
              memories.map((memory) => (
                <Card key={memory._id} className="bg-default-100" shadow="none">
                  <CardBody className="p-4">
                    {editingMemory?.id === memory._id ? (
                      <div className="space-y-3">
                        <Textarea
                          classNames={{
                            input: cn("min-h-[80px]"),
                          }}
                          value={editingMemory.memory}
                          onChange={(e) =>
                            setEditingMemory({
                              ...editingMemory,
                              memory: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Select
                            className="max-w-[150px]"
                            placeholder="Category"
                            selectedKeys={
                              editingMemory.category
                                ? [editingMemory.category]
                                : []
                            }
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;

                              setEditingMemory({
                                ...editingMemory,
                                category: selectedKey || undefined,
                              });
                            }}
                          >
                            {memoryCategories.map((category) => (
                              <SelectItem key={category.key}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button
                            color="success"
                            size="sm"
                            variant="flat"
                            onPress={handleUpdateMemory}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => setEditingMemory(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-default-600">
                            {memory.memory}
                          </p>
                          {memory.category && (
                            <Chip
                              className="mt-2"
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
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() =>
                              setEditingMemory({
                                id: memory._id,
                                memory: memory.memory,
                                category: memory.category,
                              })
                            }
                          >
                            <Icon className="h-4 w-4" icon="mdi:pencil" />
                          </Button>
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            variant="light"
                            onPress={() => handleDeleteMemory(memory._id)}
                          >
                            <Icon className="h-4 w-4" icon="mdi:delete" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="bg-default-100" shadow="none">
                <CardBody className="p-6 text-center">
                  <Icon
                    className="mx-auto mb-3 text-default-400"
                    icon="mdi:brain"
                    width={48}
                  />
                  <p className="text-sm font-medium text-default-600">
                    No memories stored yet
                  </p>
                  <p className="text-xs text-default-400">
                    Add your first memory to help personalize your AI experience
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  },
);

MemorySetting.displayName = "MemorySetting";

export default MemorySetting;
