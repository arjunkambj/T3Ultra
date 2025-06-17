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

interface ProjectChatDropdownProps {
  chat: Chat;
  onDelete: (chatId: string) => void;
  onPin: (chatId: string) => void;
}

export default function ProjectChatDropdown({
  chat,
  onDelete,
  onPin,
}: ProjectChatDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      onDelete(chat.id);

      if (pathname === `/chat/${chat.id}`) {
        router.push("/chat");
      }

      addToast({
        title: "Chat deleted",
        description: "Chat has been removed from project",
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error deleting chat",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  const handlePin = async () => {
    try {
      onPin(chat.id);
      addToast({
        title: "Chat pinned",
        description: "Chat has been pinned in project",
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

  const handleEditTitle = async () => {
    addToast({
      title: "Edit chat title",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleMoveToProject = async () => {
    addToast({
      title: "Move to project",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleRemoveFromProject = async () => {
    addToast({
      title: "Remove from project",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const items = [
    {
      key: "pin",
      label: "Pin in project",
      icon: <Icon icon="mdi:pin" width={16} />,
      onPress: handlePin,
    },
    {
      key: "edit-title",
      label: "Edit title",
      icon: <Icon icon="mdi:pencil" width={16} />,
      onPress: handleEditTitle,
    },
    {
      key: "move-project",
      label: "Move to project",
      icon: <Icon icon="mdi:folder-move" width={16} />,
      onPress: handleMoveToProject,
    },
    {
      key: "remove-project",
      label: "Remove from project",
      icon: <Icon icon="mdi:folder-remove" width={16} />,
      onPress: handleRemoveFromProject,
    },
    {
      key: "delete",
      label: "Delete chat",
      icon: <Icon icon="mdi:delete" width={16} />,
      onPress: handleDelete,
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger className="cursor-pointer outline-none hover:text-danger">
        <Icon icon="mdi:dots-horizontal" width={16} />
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
