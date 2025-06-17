"use client";

import { usePathname, useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";
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
  isPinned: boolean;
  usageCount: number;
  lastUsed: number;
  status: "active" | "archived";
  capabilities: string[];
}

interface AgentDropdownProps {
  agent: Agent;
  onTogglePin: (agentId: string) => void;
  onDelete: (agentId: string) => void;
  onArchive: (agentId: string) => void;
}

export default function AgentDropdown({
  agent,
  onTogglePin,
  onDelete,
  onArchive,
}: AgentDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      onDelete(agent.id);

      // If currently viewing this agent, redirect to main agent page
      if (pathname === `/agent/${agent.id}`) {
        router.push("/agent");
      }

      addToast({
        title: "Agent deleted",
        description: `${agent.name} has been deleted`,
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error deleting agent",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  const handlePin = async () => {
    try {
      onTogglePin(agent.id);
      addToast({
        title: agent.isPinned ? "Agent unpinned" : "Agent pinned",
        description: `${agent.name} has been ${agent.isPinned ? "unpinned" : "pinned"}`,
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Something went wrong",
        color: "danger",
      });
    }
  };

  const handleArchive = async () => {
    try {
      onArchive(agent.id);
      const newStatus = agent.status === "active" ? "archived" : "active";

      addToast({
        title: `Agent ${newStatus}`,
        description: `${agent.name} has been ${newStatus}`,
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Something went wrong",
        color: "danger",
      });
    }
  };

  const handleEditAgent = async () => {
    router.push(`/agent/${agent.id}/edit`);
  };

  const handleViewAgent = async () => {
    router.push(`/agent/${agent.id}`);
  };

  const handleChatWithAgent = async () => {
    router.push(`/chat?agent=${agent.id}`);
  };

  const handleDuplicateAgent = async () => {
    addToast({
      title: "Duplicate agent",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleShareAgent = async () => {
    if (agent.isPublic) {
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

  const items = [
    {
      key: "view",
      label: "View agent",
      icon: <Icon icon="mdi:eye" width={16} />,
      onPress: handleViewAgent,
    },
    {
      key: "chat",
      label: "Chat with agent",
      icon: <Icon icon="mdi:chat" width={16} />,
      onPress: handleChatWithAgent,
    },
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
      key: "pin",
      label: agent.isPinned ? "Unpin agent" : "Pin agent",
      icon: (
        <Icon icon={agent.isPinned ? "mdi:pin-off" : "mdi:pin"} width={16} />
      ),
      onPress: handlePin,
    },
    {
      key: "share",
      label: "Share agent",
      icon: <Icon icon="mdi:share" width={16} />,
      onPress: handleShareAgent,
    },
    {
      key: "archive",
      label: agent.status === "active" ? "Archive agent" : "Unarchive agent",
      icon: (
        <Icon
          icon={agent.status === "active" ? "mdi:archive" : "mdi:archive-off"}
          width={16}
        />
      ),
      onPress: handleArchive,
    },
    {
      key: "delete",
      label: "Delete agent",
      icon: <Icon icon="mdi:delete" width={16} />,
      onPress: handleDelete,
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger className="cursor-pointer outline-none hover:text-danger">
        <Icon icon="mdi:dots-horizontal" width={20} />
      </DropdownTrigger>
      <DropdownMenu items={items}>
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
  );
}
