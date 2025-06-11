import UserMessage from "./UserMessage";
import AssiantaceMessage from "./AssiantaceMessage";
import AIThinkingSpinner from "./AIThinkingSpinner";
import Source from "./Source";

export default function MessageUI({
  message,
  status,
}: {
  message: any[];
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  return (
    <div className="flex flex-col gap-2 h-full max-w-3xl w-full space-y-5 pt-10">
      {message.map((item) => {
        if (item.role === "user") {
          return (
            <div key={item.id} className="flex justify-end">
              <UserMessage message={item.content} />
            </div>
          );
        } else if (item.role === "assistant") {
          // if assistant message has actual text content
          const hasTextContent = (() => {
            // Check content property
            if (item.content && item.content.trim().length > 0) {
              return true;
            }
            // Doing this because sometimes assistant message is not a text but a tool invocation
            if (item.parts) {
              return item.parts.some(
                (part: any) =>
                  part.type === "text" &&
                  part.text &&
                  part.text.trim().length > 0
              );
            }
            return false;
          })();

          // Get sources from the message parts
          const sources = item.parts
            ? item.parts.filter((part: any) => part.type === "source")
            : [];

          // Get sources from tool results (alternative approach)
          const toolSources = item.parts
            ? (() => {
                const toolResults = item.parts.filter(
                  (part: any) =>
                    part.type === "tool-invocation" &&
                    part.toolInvocation?.state === "result" &&
                    part.toolInvocation?.result?.sources
                );

                return toolResults.flatMap(
                  (toolPart: any) =>
                    toolPart.toolInvocation.result.sources || []
                );
              })()
            : [];

          const allSources = [...sources, ...toolSources];

          if (hasTextContent) {
            return (
              <div key={item.id} className="flex justify-start">
                <div className="flex flex-col gap-3">
                  <AssiantaceMessage message={item.content} />

                  {/* Render sources if available */}
                  {allSources.length > 0 && <Source source={allSources} />}
                </div>
              </div>
            );
          }
        }
        return null;
      })}

      <AIThinkingSpinner status={status} messages={message} />
    </div>
  );
}
