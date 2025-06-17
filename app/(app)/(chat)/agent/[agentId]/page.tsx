import AgentDetail from "@/components/agent/AgentDetail";

interface AgentPageProps {
  params: {
    agentId: string;
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  return <AgentDetail agentId={params.agentId} />;
}
