import AgentForm from "@/components/agent/AgentForm";

interface EditAgentPageProps {
  params: {
    agentId: string;
  };
}

export default function EditAgentPage({ params }: EditAgentPageProps) {
  return (
    <div className="flex h-dvh justify-center gap-6 overflow-y-auto p-6 pt-10">
      <div className="flex flex-col gap-6">
        <AgentForm agentId={params.agentId} />
      </div>
    </div>
  );
}
