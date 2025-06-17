"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  isPublic: boolean;
  usageCount: number;
  lastUsed: number;
  status: "active" | "archived";
  capabilities: string[];
  rating: number;
  createdBy: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface AgentDetailProps {
  agentId: string;
}

// Mock data - replace with actual data from Convex
const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Code Assistant",
    description:
      "Specialized in helping with programming tasks, debugging, and code reviews. Expert in multiple programming languages and frameworks.",
    avatar: "🤖",
    category: "development",
    isPublic: true,
    usageCount: 156,
    lastUsed: new Date().getTime() - 86400000,
    status: "active",
    capabilities: ["coding", "debugging", "code-review"],
    rating: 4.8,
    createdBy: "You",
    systemPrompt:
      "You are a specialized coding assistant with expertise in multiple programming languages and frameworks. Help users with programming tasks, debugging, code reviews, and best practices. Always provide clear explanations and suggest improvements when possible.",
    temperature: 0.3,
    maxTokens: 2000,
  },
  {
    id: "agent-2",
    name: "Writing Coach",
    description:
      "Expert in creative writing, editing, and content creation. Helps improve writing style and grammar.",
    avatar: "✍️",
    category: "writing",
    isPublic: false,
    usageCount: 89,
    lastUsed: new Date().getTime() - 172800000,
    status: "active",
    capabilities: ["writing", "editing", "creativity"],
    rating: 4.6,
    createdBy: "You",
    systemPrompt:
      "You are a professional writing coach and editor. Help users improve their writing style, grammar, and overall content quality. Provide constructive feedback and suggestions for enhancement.",
    temperature: 0.7,
    maxTokens: 2500,
  },
];

export default function AgentDetail({ agentId }: AgentDetailProps) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading agent data
    const loadAgent = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundAgent = mockAgents.find((a) => a.id === agentId);

      setAgent(foundAgent || null);
      setIsLoading(false);
    };

    loadAgent();
  }, [agentId]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return "Recently";
    }
  };

  const formatUsageCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }

    return count.toString();
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      development: "mdi:code-tags",
      writing: "mdi:pencil",
      analytics: "mdi:chart-line",
      education: "mdi:school",
      design: "mdi:palette",
      business: "mdi:briefcase",
    };

    return icons[category] || "mdi:robot";
  };

  const handleChatWithAgent = () => {
    router.push(`/chat?agent=${agentId}`);
  };

  const handleEditAgent = () => {
    router.push(`/agent/${agentId}/edit`);
  };

  const handleDeleteAgent = () => {
    addToast({
      title: "Delete agent",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleDuplicateAgent = () => {
    addToast({
      title: "Duplicate agent",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleShareAgent = () => {
    if (agent?.isPublic) {
      addToast({
        title: "Share agent",
        description: "Coming soon",
        color: "default",
        timeout: 2000,
      });
    } else {
      addToast({
        title: "Private agent",
        description: "Make agent public to share",
        color: "warning",
        timeout: 2000,
      });
    }
  };

  const dropdownItems = [
    {
      key: "edit",
      label: "Edit agent",
      icon: <Icon icon="mdi:pencil" width={16} />,
      onPress: handleEditAgent,
    },
    {
      key: "duplicate",
      label: "Duplicate agent",
      icon: <Icon icon="mdi:content-copy" width={16} />,
      onPress: handleDuplicateAgent,
    },
    {
      key: "share",
      label: "Share agent",
      icon: <Icon icon="mdi:share" width={16} />,
      onPress: handleShareAgent,
    },
    {
      key: "delete",
      label: "Delete agent",
      icon: <Icon icon="mdi:delete" width={16} />,
      onPress: handleDeleteAgent,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-300" />
          <p className="text-neutral-400">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-neutral-800 p-6">
            <Icon
              className="text-neutral-400"
              icon="mdi:robot-confused"
              width={48}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-200">
              Agent not found
            </h3>
            <p className="text-sm text-neutral-400">
              The agent you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
          </div>
          <Button
            className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            onPress={() => router.push("/agent")}
          >
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-2xl">
            {agent.avatar}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-100">
                {agent.name}
              </h1>
              {agent.status === "archived" && (
                <div className="rounded-full bg-neutral-700 px-3 py-1 text-sm text-neutral-300">
                  Archived
                </div>
              )}
              {!agent.isPublic && (
                <Icon className="text-neutral-500" icon="mdi:lock" width={20} />
              )}
            </div>
            <p className="max-w-2xl text-neutral-400">{agent.description}</p>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <Icon icon={getCategoryIcon(agent.category)} width={16} />
                <span className="capitalize">{agent.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon className="text-yellow-500" icon="mdi:star" width={16} />
                <span>{agent.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:chat" width={16} />
                <span>{formatUsageCount(agent.usageCount)} uses</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:clock" width={16} />
                <span>Last used {formatTimeAgo(agent.lastUsed)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            startContent={<Icon icon="mdi:chat" width={20} />}
            onPress={handleChatWithAgent}
          >
            Start Chat
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                className="text-neutral-400 hover:text-neutral-200"
                variant="flat"
              >
                <Icon icon="mdi:dots-horizontal" width={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu items={dropdownItems}>
              {(item) => (
                <DropdownItem
                  key={item.key}
                  className={item.key === "delete" ? "text-danger" : ""}
                  color={item.key === "delete" ? "danger" : "default"}
                  startContent={item.icon}
                  onPress={item.onPress}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Content */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Capabilities */}
          <Card className="border border-neutral-700 bg-neutral-900">
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-200">
                Capabilities
              </h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300"
                  >
                    {capability}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* System Prompt */}
          <Card className="border border-neutral-700 bg-neutral-900">
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-200">
                System Prompt
              </h3>
            </CardHeader>
            <CardBody>
              <p className="whitespace-pre-wrap text-neutral-300">
                {agent.systemPrompt}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Settings */}
          <Card className="border border-neutral-700 bg-neutral-900">
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-200">
                Settings
              </h3>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Temperature</span>
                <span className="text-sm text-neutral-200">
                  {agent.temperature}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Max Tokens</span>
                <span className="text-sm text-neutral-200">
                  {agent.maxTokens}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Visibility</span>
                <span className="text-sm text-neutral-200">
                  {agent.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Created by</span>
                <span className="text-sm text-neutral-200">
                  {agent.createdBy}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-neutral-700 bg-neutral-900">
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-200">
                Quick Actions
              </h3>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <Button
                className="justify-start bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                startContent={<Icon icon="mdi:chat" width={16} />}
                onPress={handleChatWithAgent}
              >
                Start New Chat
              </Button>
              <Button
                className="justify-start bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                startContent={<Icon icon="mdi:pencil" width={16} />}
                onPress={handleEditAgent}
              >
                Edit Agent
              </Button>
              <Button
                className="justify-start bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                startContent={<Icon icon="mdi:content-copy" width={16} />}
                onPress={handleDuplicateAgent}
              >
                Duplicate Agent
              </Button>
              <Button
                className="justify-start bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                startContent={<Icon icon="mdi:share" width={16} />}
                onPress={handleShareAgent}
              >
                Share Agent
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
