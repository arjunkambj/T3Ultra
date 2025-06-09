import { Markdown } from "./sub/markdown";

export default function AssiantaceMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col max-w-2xl gap-2">
      <Markdown>{message}</Markdown>
    </div>
  );
}
