import UserMessage from "./UserMessage";
import AssiantaceMessage from "./AssiantaceMessage";

export default function MessageUI({ message }: { message: any[] }) {
  return (
    <div className="flex flex-col gap-2 h-full max-w-2xl w-full space-y-5 pt-10">
      {message.map((item) => {
        return item.role === "user" ? (
          <div className="flex justify-end">
            <UserMessage key={item.id} message={item.message} />
          </div>
        ) : (
          <div className="flex justify-start">
            <AssiantaceMessage key={item.id} message={item.message} />
          </div>
        );
      })}
    </div>
  );
}
