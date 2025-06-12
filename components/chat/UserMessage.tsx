import React from "react";

export default function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-default-200 px-5 py-3">
      <div className="flex flex-row gap-2">{message}</div>
    </div>
  );
}
