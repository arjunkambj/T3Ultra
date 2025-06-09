import UserMessage from "./UserMessage";
import AssiantaceMessage from "./AssiantaceMessage";

export default function MessageUI({ message }: { message: any[] }) {
  return (
    <div className="flex flex-col gap-2 h-full max-w-3xl w-full space-y-5 pt-10">
      {message.map((item) => {
        return item.role === "user" ? (
          <div key={item.id} className="flex justify-end">
            <UserMessage message={item.content} />
          </div>
        ) : (
          <div key={item.id} className="flex justify-start">
            <AssiantaceMessage message={item.content} />
          </div>
        );
      })}
    </div>
  );
}
