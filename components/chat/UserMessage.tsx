"use client";

import UserToolkit from "./sub/UserToolkit";
import { useState } from "react";
import EditInput from "./sub/EditInput";
import { Icon } from "@iconify/react/dist/iconify.js";

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
