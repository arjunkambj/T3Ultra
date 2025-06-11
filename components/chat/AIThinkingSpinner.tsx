import { Spinner } from "@heroui/spinner";

export default function AIThinkingSpinner({
  status,
  messages,
}: {
  status: "submitted" | "streaming" | "ready" | "error";
  messages?: any[];
}) {
  // Check if there are any Google search tool calls in the last message
  const isSearchingInternet =
    messages && messages.length > 0
      ? (() => {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage?.role === "assistant" && lastMessage?.parts) {
            return lastMessage.parts.some(
              (part: any) =>
                part.type === "tool-invocation" &&
                (part.toolInvocation?.state === "call" ||
                  part.toolInvocation?.state === "partial-call") &&
                part.toolInvocation?.toolName === "googleSearch"
            );
          }
          return false;
        })()
      : false;

  // Check if the last message is from assistant and has actual text content
  const hasAssistantTextResponse =
    messages && messages.length > 0
      ? (() => {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage?.role === "assistant") {
            // Check if there's any text content in the message
            if (lastMessage.content && lastMessage.content.trim().length > 0) {
              return true;
            }
            // Check if there are text parts
            if (lastMessage.parts) {
              return lastMessage.parts.some(
                (part: any) =>
                  part.type === "text" &&
                  part.text &&
                  part.text.trim().length > 0
              );
            }
          }
          return false;
        })()
      : false;

  const shouldShowSpinner =
    status === "submitted" ||
    isSearchingInternet ||
    (status === "streaming" && !hasAssistantTextResponse) ||
    (status !== "ready" &&
      status !== "error" &&
      status !== "streaming" &&
      !hasAssistantTextResponse);

  // What message to show on UI
  const getStatusMessage = () => {
    if (isSearchingInternet) {
      return "Searching the internet...";
    }
    return "AI is thinking...";
  };

  return (
    shouldShowSpinner && (
      <div className="flex justify-start">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg">
          <Spinner size="sm" />
          <span className="text-sm text-default-500">{getStatusMessage()}</span>
        </div>
      </div>
    )
  );
}
