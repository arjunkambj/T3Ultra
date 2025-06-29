import { memo } from "react";
import { Markdown } from "./sub/markdown";
import AssistanceToolkit from "./sub/AssistanceToolkit";

const AssistanceMessage = memo(function AssistanceMessage({
  message,
  allmessages,
  chatId,
  isShared,
}: {
  message: any; // Full message object with id, content, role, etc.
  allmessages: any[];
  chatId: string;
  isShared: boolean;
}) {
  return (
    <div className="relative flex w-full max-w-3xl flex-col gap-2">
      <div className="w-full">
        <Markdown>{message.content}</Markdown>
      </div>

      <div className="absolute left-0 top-full z-10">
        <AssistanceToolkit
          allmessages={allmessages}
          chatId={chatId}
          isShared={isShared}
          message={message}
        />
      </div>
    </div>
  );
});

export default AssistanceMessage;
