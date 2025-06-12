import { Markdown } from "./sub/markdown";

export default function AssistanceMessage({ message }: { message: string }) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <Markdown>{message}</Markdown>
    </div>
  );
}
