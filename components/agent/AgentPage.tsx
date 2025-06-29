"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Spinner } from "@heroui/spinner";
import { memo } from "react";

import AgentCard from "./sub/AgentCard";

import { useUser } from "@/hooks/useUser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const AgentPage = memo(function AgentPage() {
  const router = useRouter();
  const user = useUser();
  const agents = useQuery(api.function.agent.getAgentByUserId, {
    userId: user?._id as Id<"users">,
  });

  const handleCreateAgent = () => {
    router.push("/agent/create");
  };

  // Show spinner while user or agents are loading
  if (!user || agents === undefined) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner color="white" />
      </div>
    );
  }

  return (
    <div className="mt-10 flex h-full max-w-4xl flex-col items-center gap-6 p-6 pt-10">
      <div className="flex max-w-2xl flex-col items-center gap-3">
        <h1 className="text-4xl font-bold text-neutral-100">Custom Agents</h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-md text-neutral-400">
            Create and manage AI agents tailored to your specific needs
          </p>
          <p className="text-center text-sm text-neutral-400">
            Agents are able to extract context from your files, such as PDFs and
            CSVs, and they always retain the context they have extracted.
          </p>
        </div>

        <Button
          fullWidth
          className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          startContent={<Icon icon="mdi:robot-excited" width={20} />}
          onPress={handleCreateAgent}
        >
          Create New Agent
        </Button>
      </div>

      <div className="w-full flex-1">
        {agents && agents.length > 0 ? (
          <div className="">
            <div className="flex flex-wrap items-center gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent._id} agent={agent} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-md text-neutral-400">
              Create your first agent to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default AgentPage;
