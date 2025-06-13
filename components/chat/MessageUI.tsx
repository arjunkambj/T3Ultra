import UserMessage from "./UserMessage";
import AssistanceMessage from "./AssistanceMessage";
import AIThinkingSpinner from "./AIThinkingSpinner";

export default function MessageUI({
  messages,
  status,
  resume,
}: {
  messages: any[];
  status: "submitted" | "streaming" | "ready" | "error";
  resume: () => void;
}) {
  return (
    <div className="flex h-full w-full max-w-3xl flex-col gap-2 space-y-5 px-3 pt-10">
      {messages?.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? (
            <div className="flex w-full justify-end">
              <UserMessage message={message.content} />
            </div>
          ) : (
            <AssistanceMessage message={message.content} />
          )}
        </div>
      ))}

      <AIThinkingSpinner messages={messages} status={status} />
    </div>
  );
}
