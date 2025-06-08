export default function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex bg-neutral-800 rounded-lg p-3 rounded-xl  px-5 flex-col gap-2">
      <p className="flex flex-col gap-2">{message}</p>
    </div>
  );
}
