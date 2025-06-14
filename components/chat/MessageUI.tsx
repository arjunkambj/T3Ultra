import UserMessage from "./UserMessage";
import AssistanceMessage from "./AssistanceMessage";
import AIThinkingSpinner from "./AIThinkingSpinner";

export default function MessageUI({
  messages,
  status,
  resume,
  reload,
  chatId,
  isShared,
}: {
  messages: any[];
  status: "submitted" | "streaming" | "ready" | "error";
  resume: () => void;
  reload: () => void;
  chatId: string;
  isShared: boolean;
}) {
  return (
    <div className="flex h-full w-full max-w-3xl flex-col gap-10 space-y-5 px-3 pt-10">
      {messages?.map((message) => (
        <div className="pb-16" key={message.id}>
          {message.role === "user" ? (
            <div className="flex w-full justify-end">
              <UserMessage
                isShared={isShared}
                message={message.content}
                reload={reload}
                key={message.id}
              />
            </div>
          ) : (
            <AssistanceMessage
              isShared={isShared}
              message={message}
              allmessages={messages}
              chatId={chatId}
              key={message.id}
            />
          )}
        </div>
      ))}

      <AIThinkingSpinner messages={messages} status={status} />
    </div>
  );
}
