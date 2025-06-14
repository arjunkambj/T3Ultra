import { Markdown } from "./sub/markdown";
import AssistanceToolkit from "./sub/AssistanceToolkit";
import { useState } from "react";

export default function AssistanceMessage({
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
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative flex w-full max-w-3xl flex-col gap-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-full">
        <Markdown>{message.content}</Markdown>
      </div>
      {isHovering && (
        <div className="absolute left-0 top-full z-10">
          <AssistanceToolkit
            message={message}
            allmessages={allmessages}
            chatId={chatId}
            isShared={isShared}
          />
        </div>
      )}
    </div>
  );
}
