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

interface Chat {
  id: string;
  title: string;
  projectId: string;
  updatedAt: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  isPinned: boolean;
  chats: Chat[];
}

interface ProjectDropdownProps {
  project: Project;
  onTogglePin: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectDropdown({
  project,
  onTogglePin,
  onDelete,
}: ProjectDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      onDelete(project.id);

      // If currently viewing a chat from this project, redirect to main chat
      const isViewingProjectChat = project.chats.some(
        (chat) => pathname === `/chat/${chat.id}`,
      );

      if (isViewingProjectChat) {
        router.push("/chat");
      }

      addToast({
        title: "Project deleted",
        description: `${project.title} has been deleted`,
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error deleting project",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  const handlePin = async () => {
    try {
      onTogglePin(project.id);
      addToast({
        title: project.isPinned ? "Project unpinned" : "Project pinned",
        description: `${project.title} has been ${project.isPinned ? "unpinned" : "pinned"}`,
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

  const handleEditProject = async () => {
    addToast({
      title: "Edit project",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleViewProject = async () => {
    router.push(`/project/${project.id}`);
  };

  const handleCreateChat = async () => {
    addToast({
      title: "Create chat in project",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const items = [
    {
      key: "view",
      label: "View project",
      icon: <Icon icon="mdi:eye" width={16} />,
      onPress: handleViewProject,
    },
    {
      key: "create-chat",
      label: "Create chat",
      icon: <Icon icon="mdi:chat-plus" width={16} />,
      onPress: handleCreateChat,
    },
    {
      key: "pin",
      label: project.isPinned ? "Unpin project" : "Pin project",
      icon: (
        <Icon icon={project.isPinned ? "mdi:pin-off" : "mdi:pin"} width={16} />
      ),
      onPress: handlePin,
    },
    {
      key: "edit",
      label: "Edit project",
      icon: <Icon icon="mdi:pencil" width={16} />,
      onPress: handleEditProject,
    },
    {
      key: "delete",
      label: "Delete project",
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
