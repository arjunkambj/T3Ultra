"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Avatar } from "@heroui/avatar";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  isPinned: boolean;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  const handlePinAgent = () => {
    addToast({
      title: "Pin agent",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  const handleEditAgent = () => {
    router.push(`/agent/edit/${agent.id}`);
  };

  const handleChatWithAgent = () => {
    router.push(`/agent/${agent.id}`);
  };

  const handleDelete = () => {
    addToast({
      title: "Delete agent",
      description: "Coming soon",
      color: "default",
      timeout: 2000,
    });
  };

  return (
    <Card
      className={`group relative max-w-sm border px-2 py-1 transition-all duration-200 hover:shadow-lg ${"border-neutral-700 bg-neutral-900 hover:border-neutral-600"}`}
      shadow="none"
    >
      <CardBody className="">
        <div className="flex items-center gap-4">
          <div>
            <Avatar size="lg" src={agent.avatar} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-medium text-neutral-100">
              {agent.name}
            </h3>
            <p className="text-xs text-neutral-400">{agent.description}</p>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            className="flex-1 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            size="sm"
            onPress={handleChatWithAgent}
          >
            <Icon icon="mdi:chat" width={16} />
            Chat
          </Button>
          <Button
            className="flex-1 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            size="sm"
            variant="flat"
            onPress={handleEditAgent}
          >
            <Icon icon="mdi:pencil" width={16} />
            Edit
          </Button>
          <Button
            isIconOnly
            className="text-neutral-400 hover:text-neutral-200"
            size="sm"
            variant="flat"
            onPress={handlePinAgent}
          >
            {agent.isPinned ? (
              <Icon icon="mdi:pin" width={16} />
            ) : (
              <Icon icon="mdi:pin-off" width={16} />
            )}
          </Button>

          <Button
            isIconOnly
            className="text-neutral-400 hover:bg-danger-500 hover:text-white"
            size="sm"
            variant="flat"
            onPress={handleDelete}
          >
            <Icon icon="mdi:delete" width={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
