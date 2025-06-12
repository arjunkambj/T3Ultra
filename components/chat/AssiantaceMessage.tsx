import { Markdown } from "./sub/markdown";

export default function AssiantaceMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col max-w-3xl w-full gap-2">
      <Markdown>{message}</Markdown>
    </div>
  );
}
