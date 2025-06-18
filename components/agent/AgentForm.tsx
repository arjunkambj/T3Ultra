"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useMutation } from "convex/react";
import axios from "axios";

import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { Id } from "@/convex/_generated/dataModel";

interface AgentFormData {
  name: string;
  description: string;
  avatar: string;
  category: string;
  systemPrompt: string;
  capabilities: string[];
  isPublic: boolean;
  temperature: number;
  maxTokens: number;
}

const agentCategories = [
  { key: "development", label: "Development" },
  { key: "writing", label: "Writing & Content" },
  { key: "analytics", label: "Data & Analytics" },
  { key: "education", label: "Education & Learning" },
  { key: "design", label: "Design & Creative" },
  { key: "business", label: "Business & Finance" },
  { key: "research", label: "Research & Analysis" },
  { key: "productivity", label: "Productivity" },
  { key: "other", label: "Other" },
];

const commonCapabilities = [
  "coding",
  "debugging",
  "code-review",
  "writing",
  "editing",
  "creativity",
  "data-analysis",
  "visualization",
  "statistics",
  "language",
  "translation",
  "education",
  "tutoring",
  "research",
  "planning",
  "brainstorming",
];

interface AgentFormProps {
  agentId?: string;
}

export default function AgentForm({ agentId }: AgentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    avatar: "",
    category: "",
    systemPrompt: "",
    capabilities: [],
    isPublic: false,
    temperature: 0.7,
    maxTokens: 2000,
  });
  const [capabilityInput, setCapabilityInput] = useState("");
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatar, setAvatar] = useState("🤖");

  // Load existing agent data when editing
  const existingAgent = useQuery(
    api.function.agent.getAgentById,
    agentId ? { agentId: agentId as Id<"agent"> } : "skip",
  );

  const createAgent = useMutation(api.function.agent.createAgent);
  const updateAgent = useMutation(api.function.agent.updateAgent);

  // Populate form with existing agent data when editing
  useEffect(() => {
    if (existingAgent && agentId) {
      setFormData({
        name: existingAgent.name || "",
        description: existingAgent.description || "",
        avatar: existingAgent.avatar || "",
        category: existingAgent.category || "",
        systemPrompt: existingAgent.instructions || "",
        capabilities: existingAgent.capabilities || [],
        isPublic: false, // This field doesn't exist in schema, keeping default
        temperature: 0.7, // This field doesn't exist in schema, keeping default
        maxTokens: 2000, // This field doesn't exist in schema, keeping default
      });
      setAvatar(existingAgent.avatar || "🤖");
    }
  }, [existingAgent, agentId]);

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCapability = () => {
    if (
      capabilityInput.trim() &&
      !formData.capabilities.includes(capabilityInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        capabilities: [...prev.capabilities, capabilityInput.trim()],
      }));
      setCapabilityInput("");
    }
  };

  const handleRemoveCapability = (capabilityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter(
        (cap) => cap !== capabilityToRemove,
      ),
    }));
  };

  const handleAddCommonCapability = (capability: string) => {
    if (!formData.capabilities.includes(capability)) {
      setFormData((prev) => ({
        ...prev,
        capabilities: [...prev.capabilities, capability],
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCapability();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast({
        title: "Validation Error",
        description: "Agent name is required",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    if (!formData.description.trim()) {
      addToast({
        title: "Validation Error",
        description: "Agent description is required",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    if (!formData.systemPrompt.trim()) {
      addToast({
        title: "Validation Error",
        description: "System prompt is required",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    setIsLoading(true);

    try {
      if (agentId) {
        await updateAgent({
          agentId: agentId as Id<"agent">,
          name: formData.name,
          description: formData.description,
          avatar: formData.avatar,
          category: formData.category,
          instructions: formData.systemPrompt,
          capabilities: formData.capabilities,
          isPinned: false,
        });
      } else {
        await createAgent({
          name: formData.name,
          description: formData.description,
          avatar: formData.avatar,
          category: formData.category,
          instructions: formData.systemPrompt,
          capabilities: formData.capabilities,
          isPinned: false,
          userId: user?._id as Id<"users">,
        });
      }

      addToast({
        title: agentId ? "Agent Updated" : "Agent Created",
        description: `${formData.name} has been ${agentId ? "updated" : "created"} successfully`,
        color: "success",
        timeout: 3000,
      });

      if (!agentId) {
        setFormData({
          name: "",
          description: "",
          avatar: "",
          category: "",
          systemPrompt: "",
          capabilities: [],
          isPublic: false,
          temperature: 0.7,
          maxTokens: 2000,
        });
      }

      // Navigate to agent detail page if editing, otherwise to agents list
      router.push(agentId ? `/agent/${agentId}` : "/agent");
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
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

  // Show loading when submitting or when loading existing agent data for editing
  if (isLoading || (agentId && existingAgent === undefined)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-300" />
          <p className="text-neutral-400">
            {isLoading ? "Saving..." : "Loading agent..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-lg">
      <div className="flex flex-col items-start gap-2 p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-neutral-800 p-2">
            <Icon
              className="text-neutral-300"
              icon="mdi:robot-excited"
              width={24}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">
              {agentId ? "Edit Agent" : "Create Custom Agent"}
            </h1>
            <p className="text-sm text-neutral-400">
              {agentId
                ? "Update your AI agent's configuration and behavior"
                : "Design an AI agent tailored to your specific needs and workflows"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-neutral-200">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                isRequired
                classNames={{
                  input: "bg-neutral-800 border-neutral-600",
                  inputWrapper:
                    "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                }}
                label="Agent Name"
                placeholder="Enter agent name..."
                startContent={
                  <Icon
                    className="text-neutral-400"
                    icon="mdi:robot"
                    width={20}
                  />
                }
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />

              <div className="flex items-center gap-2">
                <Input
                  accept="image/*"
                  classNames={{
                    input: "bg-neutral-800 border-neutral-600",
                    inputWrapper:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  label="Upload Avatar"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      try {
                        const response = await axios.post(
                          `/api/upload/avatar?filename=${encodeURIComponent(file.name)}`,
                          file,
                          {
                            headers: {
                              "Content-Type": file.type,
                            },
                          },
                        );
                        const avatarUrl = response.data.url;

                        setAvatar(avatarUrl);
                        handleInputChange("avatar", avatarUrl);
                      } catch (err) {
                        void err;
                        addToast({
                          title: "Upload Error",
                          description:
                            "Failed to upload avatar. Please try again.",
                          color: "danger",
                          timeout: 3000,
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>

            <Textarea
              isRequired
              classNames={{
                input: "bg-neutral-800 border-neutral-600",
                inputWrapper:
                  "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
              }}
              label="Description"
              maxRows={6}
              minRows={3}
              placeholder="Describe what this agent does and how it helps..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

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
              {agentCategories.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* System Prompt */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-neutral-200">
              Behavior & Instructions
            </h3>

            <Textarea
              isRequired
              classNames={{
                input: "bg-neutral-800 border-neutral-600",
                inputWrapper:
                  "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
              }}
              description="This defines the agent's personality, expertise, and how it should respond to users."
              label="System Prompt"
              maxRows={12}
              minRows={6}
              placeholder="Define how the agent should behave, its personality, and specific instructions..."
              value={formData.systemPrompt}
              onChange={(e) =>
                handleInputChange("systemPrompt", e.target.value)
              }
            />
          </div>

          {/* Capabilities */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-neutral-200">
              Capabilities
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  classNames={{
                    input: "bg-neutral-800 border-neutral-600",
                    inputWrapper:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  placeholder="Add a capability..."
                  value={capabilityInput}
                  onChange={(e) => setCapabilityInput(e.target.value)}
                  onKeyUp={handleKeyPress}
                />
                <Button
                  isIconOnly
                  className="bg-neutral-800 text-neutral-300"
                  isDisabled={!capabilityInput.trim()}
                  type="button"
                  variant="flat"
                  onPress={handleAddCapability}
                >
                  <Icon icon="mdi:plus" width={20} />
                </Button>
              </div>

              {/* Common Capabilities */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-400" htmlFor="quick-add">
                  Quick add:
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonCapabilities.map((capability) => (
                    <button
                      key={capability}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        formData.capabilities.includes(capability)
                          ? "cursor-not-allowed bg-neutral-700 text-neutral-500"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                      disabled={formData.capabilities.includes(capability)}
                      type="button"
                      onClick={() => handleAddCommonCapability(capability)}
                    >
                      {capability}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Capabilities */}
              {formData.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.capabilities.map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center gap-1 rounded-full bg-neutral-700 px-3 py-1 text-sm text-neutral-200"
                    >
                      <span>{capability}</span>
                      <button
                        className="text-neutral-400 hover:text-neutral-200"
                        type="button"
                        onClick={() => handleRemoveCapability(capability)}
                      >
                        <Icon icon="mdi:close" width={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                !isLoading && <Icon icon="mdi:robot-excited" width={20} />
              }
              type="submit"
            >
              {isLoading
                ? agentId
                  ? "Updating Agent..."
                  : "Creating Agent..."
                : agentId
                  ? "Update Agent"
                  : "Create Agent"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
