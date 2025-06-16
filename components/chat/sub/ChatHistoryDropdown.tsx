import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

export default function ChatHistoryDropdown({
  chatId,
  isPinned,
}: {
  chatId: string;
  isPinned: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const deleteChat = useMutation(api.function.chats.deleteChatByChatId);
  const updateChatIsPinned = useMutation(api.function.chats.updateChatIsPinned);

  const handleDelete = async () => {
    try {
      await deleteChat({ chatId });

      if (pathname === `/chat/${chatId}`) {
        router.push("/chat");
      }
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
      await updateChatIsPinned({ chatId, isPinned: !isPinned });
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
      title: "Edit title",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleAddToProject = async () => {
    addToast({
      title: "Add to project",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const items = [
    {
      key: "pin",
      label: isPinned ? "Unpin chat" : "Pin chat",
      icon: <Icon icon={isPinned ? "mdi:pin-off" : "mdi:pin"} width={16} />,
      onPress: handlePin,
    },
    {
      key: "edit title",
      label: "Edit title",
      icon: <Icon icon="mdi:pencil" width={16} />,
      onPress: handleEditTitle,
    },
    {
      key: "add to project",
      label: "Add to project",
      icon: <Icon icon="mdi:folder-plus" width={16} />,
      onPress: handleAddToProject,
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
        <Icon icon="mdi:dots-horizontal" width={24} />
      </DropdownTrigger>
      <DropdownMenu items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            className={item.key === "delete" ? "text-danger" : ""}
            startContent={item.icon}
            color={item.key === "delete" ? "danger" : "default"}
            onPress={item.onPress}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
