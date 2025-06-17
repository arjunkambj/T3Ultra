import AgentForm from "@/components/agent/AgentForm";

interface EditAgentPageProps {
  params: {
    agentId: string;
  };
}

export default function EditAgentPage({ params }: EditAgentPageProps) {
  return <AgentForm agentId={params.agentId} />;
}
