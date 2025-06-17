"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import AgentCard from "./AgentCard";

const agents = [
  {
    id: "agent-1",
    name: "Code Assistant",
    description:
      "Specialized in helping with programming tasks, debugging, and code reviews. Expert in multiple programming languages and frameworks.",
    avatar: "/images/agent/agent-1.png",
    isPinned: false,
  },
  {
    id: "agent-2",
    name: "UGC Video Script Generator",
    description:
      "Expert in creative writing, editing, and content creation. Helps improve writing style and grammar.",
    avatar: "/images/agent/agent-2.png",
    isPinned: true,
  },
  {
    id: "agent-3",
    name: "Data Analyst",
    description:
      "Specialized in data analysis, visualization, and statistical insights. Perfect for business intelligence tasks.",
    avatar: "/images/agent/agent-3.png",
    isPinned: true,
  },
  {
    id: "agent-4",
    name: "Language Tutor",
    description:
      "Helps with language learning and translation tasks. Supports multiple languages and cultural contexts.",
    avatar: "/images/agent/agent-4.png",
    isPinned: false,
  },
];

export default function AgentPage() {
  const router = useRouter();

  const handleCreateAgent = () => {
    router.push("/agent/create");
  };

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
          className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          fullWidth
          startContent={<Icon icon="mdi:robot-excited" width={20} />}
          onPress={handleCreateAgent}
        >
          Create New Agent
        </Button>
      </div>

      <div className="flex-1">
        {agents.length > 0 ? (
          <div className="">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
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
}
