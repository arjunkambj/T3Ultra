"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

const projectCategories = [
  { key: "development", label: "Development" },
  { key: "research", label: "Research" },
  { key: "design", label: "Design" },
  { key: "marketing", label: "Marketing" },
  { key: "education", label: "Education" },
  { key: "business", label: "Business" },
  { key: "other", label: "Other" },
];

// Memoized tag component
const TagItem = React.memo(function TagItem({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: (tag: string) => void;
}) {
  const handleRemove = useCallback(() => {
    onRemove(tag);
  }, [onRemove, tag]);

  return (
    <div className="flex items-center gap-1 rounded-full bg-neutral-700 px-3 py-1 text-sm text-neutral-200">
      <span>{tag}</span>
      <button
        className="text-neutral-400 hover:text-neutral-200"
        type="button"
        onClick={handleRemove}
      >
        <Icon icon="mdi:close" width={14} />
      </button>
    </div>
  );
});

const ProjectForm = React.memo(function ProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
  });

  const createProject = useMutation(api.function.project.createProject);

  const handleInputChange = useCallback(
    (field: keyof ProjectFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!formData.title.trim()) {
        addToast({
          title: "Validation Error",
          description: "Project title is required",
          color: "danger",
          timeout: 3000,
        });

        return;
      }

      if (!formData.description.trim()) {
        addToast({
          title: "Validation Error",
          description: "Project description is required",
          color: "danger",
          timeout: 3000,
        });

        return;
      }

      setIsLoading(true);

      try {
        await createProject({
          name: formData.title,
          description: formData.description,
          instructions: `Project: ${formData.title}\n\nDescription: ${formData.description}\n\nCategory: ${formData.category}\n\nTags: ${formData.tags.join(", ")}`,
        });

        addToast({
          title: "Project Created",
          description: `${formData.title} has been created successfully`,
          color: "success",
          timeout: 3000,
        });

        setFormData({
          title: "",
          description: "",
          category: "",
          tags: [],
        });

        router.push("/project");
      } catch (error) {
        void error;
        addToast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, createProject, router],
  );

  const categorySelectItems = useMemo(
    () =>
      projectCategories.map((category) => (
        <SelectItem key={category.key}>{category.label}</SelectItem>
      )),
    [],
  );

  const tagElements = useMemo(
    () =>
      formData.tags.map((tag) => (
        <TagItem key={tag} tag={tag} onRemove={handleRemoveTag} />
      )),
    [formData.tags, handleRemoveTag],
  );

  const headerSection = useMemo(
    () => (
      <CardHeader className="flex flex-col items-start gap-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-neutral-800 p-2">
            <Icon
              className="text-neutral-300"
              icon="mdi:folder-plus"
              width={24}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">
              Create New Project
            </h1>
            <p className="text-sm text-neutral-400">
              Organize your chats and collaborate more effectively
            </p>
          </div>
        </div>
      </CardHeader>
    ),
    [],
  );

  const formActions = useMemo(
    () => (
      <div className="flex justify-end gap-3 pt-4">
        <Button
          className="text-neutral-400"
          isDisabled={isLoading}
          type="button"
          variant="flat"
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          isLoading={isLoading}
          startContent={
            !isLoading && <Icon icon="mdi:folder-plus" width={20} />
          }
          type="submit"
        >
          {isLoading ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    ),
    [isLoading, handleCancel],
  );

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-2xl border border-neutral-700 bg-neutral-900">
        {headerSection}

        <CardBody>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <Input
                isRequired
                classNames={{
                  input: "bg-neutral-800 border-neutral-600",
                  inputWrapper:
                    "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                }}
                label="Project Title"
                placeholder="Enter your project title..."
                startContent={
                  <Icon
                    className="text-neutral-400"
                    icon="mdi:folder"
                    width={20}
                  />
                }
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            {/* Project Description */}
            <div className="flex flex-col gap-2">
              <Textarea
                isRequired
                classNames={{
                  input: "bg-neutral-800 border-neutral-600",
                  inputWrapper:
                    "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                }}
                label="Project Description"
                maxRows={6}
                minRows={3}
                placeholder="Describe what this project is about..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            {/* Project Category */}
            <div className="flex flex-col gap-2">
              <Select
                classNames={{
                  trigger:
                    "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                }}
                label="Category"
                placeholder="Select a category"
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;

                  handleInputChange("category", selectedKey || "");
                }}
              >
                {categorySelectItems}
              </Select>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-neutral-200"
                htmlFor="tags"
              >
                Tags
              </label>
              <div className="flex gap-2">
                <Input
                  classNames={{
                    input: "bg-neutral-800 border-neutral-600",
                    inputWrapper:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  isIconOnly
                  className="bg-neutral-800 text-neutral-300"
                  isDisabled={!tagInput.trim()}
                  type="button"
                  variant="flat"
                  onPress={handleAddTag}
                >
                  <Icon icon="mdi:plus" width={20} />
                </Button>
              </div>

              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">{tagElements}</div>
              )}
            </div>

            {/* Form Actions */}
            {formActions}
          </form>
        </CardBody>
      </Card>
    </div>
  );
});

ProjectForm.displayName = "ProjectForm";

export default ProjectForm;
