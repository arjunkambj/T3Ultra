"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

const projectCategories = [
  { key: "web-development", label: "Web Development" },
  { key: "mobile-development", label: "Mobile Development" },
  { key: "ai-ml", label: "AI & Machine Learning" },
  { key: "data-science", label: "Data Science" },
  { key: "devops", label: "DevOps & Infrastructure" },
  { key: "design", label: "Design & UI/UX" },
  { key: "research", label: "Research & Analysis" },
  { key: "other", label: "Other" },
];

export default function ProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        title: "Project Created",
        description: `${formData.title} has been created successfully`,
        color: "success",
        timeout: 3000,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
      });

      // Navigate to projects page
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
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-2xl border border-neutral-700 bg-neutral-900">
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
                {projectCategories.map((category) => (
                  <SelectItem key={category.key}>{category.label}</SelectItem>
                ))}
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300"
                    >
                      <span>{tag}</span>
                      <button
                        className="text-neutral-500 hover:text-neutral-300"
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <Icon icon="mdi:close" width={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
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
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
