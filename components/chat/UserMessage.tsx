"use client";

import UserToolkit from "./sub/UserToolkit";
import { useState } from "react";
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative flex flex-col gap-2"
    >
      <div className="flex flex-col gap-2 rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-default-200 px-5 py-3">
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
            message={message}
            reload={reload}
            setEdit={setEdit}
            isShared={isShared}
          />
        </div>
      )}
    </div>
  );
}
