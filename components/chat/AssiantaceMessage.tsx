export default function AssiantaceMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex flex-col gap-2">{message}</p>
    </div>
  );
}
