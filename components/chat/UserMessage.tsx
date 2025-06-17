"use client";

import { useState } from "react";

import UserToolkit from "./sub/UserToolkit";
import EditInput from "./sub/EditInput";

export default function UserMessage({
  message,
  reload,
  isShared,
}: {
  message: string;
  reload: () => void;
  isShared: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <div
      className="relative flex flex-col gap-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col gap-2 rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl bg-default-100 px-6 py-3.5">
        {edit ? (
          <EditInput />
        ) : (
          <div className="flex flex-row gap-2">{message}</div>
        )}
      </div>
      {isHovering && (
        <div className="absolute right-0 top-full z-10 pt-2">
          <UserToolkit
            edit={edit}
            isShared={isShared}
            message={message}
            reload={reload}
            setEdit={setEdit}
          />
        </div>
      )}
    </div>
  );
}
