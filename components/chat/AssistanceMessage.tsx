import { Markdown } from "./sub/markdown";
import AssistanceToolkit from "./sub/AssistanceToolkit";
import { useState } from "react";

export default function AssistanceMessage({ message }: { message: string }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative flex w-full max-w-3xl flex-col gap-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-full">
        <Markdown>{message}</Markdown>
      </div>
      {isHovering && (
        <div className="absolute left-0 top-full z-10">
          <AssistanceToolkit />
        </div>
      )}
    </div>
  );
}
