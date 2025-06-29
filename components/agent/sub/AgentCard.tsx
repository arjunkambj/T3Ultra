"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import { useMutation } from "convex/react";
import { Chip } from "@heroui/chip";

import { Agent } from "@/types";
import { api } from "@/convex/_generated/api";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();
  const deleteAgent = useMutation(api.function.agent.deleteAgent);
  const handlePinAgent = useMutation(api.function.agent.handlePinAgent);

  const handlePinAgentMutation = () => {
    handlePinAgent({
      agentId: agent._id,
    });
  };

  const handleEditAgent = () => {
    router.push(`/agent/edit/${agent._id}`);
  };

  const handleChatWithAgent = () => {
    router.push(`/agent/${agent._id}`);
  };

  const handleDelete = async () => {
    await deleteAgent({
      agentId: agent._id,
    });
  };

  return (
    <Card
      className="group relative w-full max-w-sm border border-neutral-700 bg-neutral-900/30 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-900/70 hover:shadow-xl hover:shadow-neutral-900/20"
      shadow="sm"
    >
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            {agent.avatar ? (
              <Avatar
                className="ring-2 ring-neutral-700 ring-offset-2 ring-offset-neutral-900"
                size="lg"
                src={agent.avatar}
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 text-neutral-300 ring-2 ring-neutral-700 ring-offset-2 ring-offset-neutral-900">
                <Icon icon="mdi:robot" width={28} />
              </div>
            )}
            {agent.isPinned && (
              <div className="absolute -right-1 -top-1 rounded-full bg-primary-500 p-1">
                <Icon className="text-white" icon="mdi:pin" width={12} />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-100 transition-colors group-hover:text-white">
                {agent.name}
              </h3>
              {agent.category && (
                <Chip
                  className="bg-neutral-800 px-3 text-neutral-300"
                  size="sm"
                  variant="flat"
                >
                  {agent.category}
                </Chip>
              )}
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {agent.description}
            </p>

            {agent.capabilities && agent.capabilities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability, index) => (
                  <Chip
                    key={index}
                    className="border-neutral-600 px-3 text-xs text-neutral-400"
                    size="sm"
                    variant="bordered"
                  >
                    {capability}
                  </Chip>
                ))}
                {agent.capabilities.length > 3 && (
                  <Chip
                    className="border-neutral-600 text-xs text-neutral-400"
                    size="sm"
                    variant="bordered"
                  >
                    +{agent.capabilities.length - 3}
                  </Chip>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full gap-2">
          <Button
            className="flex-1 bg-neutral-100 font-medium text-neutral-900 hover:bg-neutral-200"
            size="sm"
            startContent={<Icon icon="mdi:chat" width={16} />}
            onPress={handleChatWithAgent}
          >
            Chat
          </Button>

          <Button
            className="flex-1 border border-neutral-600 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            size="sm"
            startContent={<Icon icon="mdi:pencil" width={16} />}
            variant="bordered"
            onPress={handleEditAgent}
          >
            Edit
          </Button>

          <Button
            isIconOnly
            className="text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            size="sm"
            variant="flat"
            onPress={handlePinAgentMutation}
          >
            <Icon
              icon={agent.isPinned ? "mdi:pin" : "mdi:pin-outline"}
              width={16}
            />
          </Button>

          <Button
            isIconOnly
            className="text-danger-400 hover:bg-danger-500/20 hover:text-danger-300"
            size="sm"
            variant="flat"
            onPress={handleDelete}
          >
            <Icon icon="mdi:delete-outline" width={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
