"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Spinner } from "@heroui/spinner";
import { memo } from "react";
import Link from "next/link";

import AgentCard from "./sub/AgentCard";

import { useUser } from "@/hooks/useUser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const AgentPage = memo(function AgentPage() {
  const user = useUser();
  const agents = useQuery(api.function.agent.getAgentByUserId, {
    userId: user?._id as Id<"users">,
  });

  // Show spinner while user or agents are loading
  if (!user) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner color="white" />
      </div>
    );
  }

  if (!agents) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Spinner color="white" />
          <p className="text-sm text-neutral-400">Loading your agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-7xl flex-col overflow-hidden">
      {/* Header Section - Only show when there are agents */}
      {agents.length > 0 && (
        <>
          <div className="flex shrink-0 flex-col items-center gap-6 px-6 pb-8 pt-12">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-neutral-800/50 p-3">
                <Icon
                  className="text-neutral-200"
                  icon="mdi:robot-excited"
                  width={32}
                />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-neutral-100">
                  Custom Agents
                </h1>
              </div>
            </div>

            <div className="max-w-2xl text-center">
              <p className="leading-relaxed text-neutral-400">
                Create and manage AI agents tailored to your specific needs.
                Agents can extract context from your files and retain knowledge
                for specialized assistance.
              </p>
            </div>

            <Button
              as={Link}
              className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              href="/agent/create"
              startContent={<Icon icon="mdi:plus" width={20} />}
            >
              Create New Agent
            </Button>
          </div>

          {/* Visual Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
        </>
      )}

      {/* Content Section */}
      <div className="flex-1 overflow-auto px-6 py-8">
        {agents.length > 0 ? (
          <div className="animate-in fade-in grid grid-cols-1 gap-6 duration-500 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent, index) => (
              <div
                key={agent._id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="relative max-w-md text-center">
              <div className="relative">
                <div className="mb-8 flex justify-center">
                  <div className="rounded-full bg-neutral-800/50 p-8">
                    <Icon
                      className="text-neutral-300"
                      icon="mdi:robot-outline"
                      width={64}
                    />
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-neutral-100">
                  No agents yet
                </h3>

                <p className="mb-8 leading-relaxed text-neutral-400">
                  Create your first AI agent to get started. Agents can help you
                  with specific tasks, remember context from your files, and
                  provide specialized assistance tailored to your needs.
                </p>

                <Button
                  as={Link}
                  className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  href="/agent/create"
                  size="lg"
                  startContent={<Icon icon="mdi:plus" width={24} />}
                >
                  Create Your First Agent
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default AgentPage;
