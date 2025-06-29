"use client";

import { useState, memo } from "react";
import { Image } from "@heroui/image";

import UserToolkit from "./sub/UserToolkit";
import EditInput from "./EditInputMessage";

const UserMessage = memo(function UserMessage({
  message,
  reload,
  isShared,
  messageId,
}: {
  message: any; // Full message object with content, experimental_attachments, etc.
  reload: () => void;
  isShared: boolean;
  messageId: string;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [edit, setEdit] = useState(false);

  const attachments = message.experimental_attachments || [];
  const hasAttachments = attachments.length > 0;

  return (
    <div
      className="relative flex flex-col gap-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col gap-2 rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl bg-default-100 px-6 py-3.5">
        {edit ? (
          <EditInput
            message={message.content}
            messageId={messageId}
            setEdit={setEdit}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {message.content && (
              <div className="flex flex-row gap-2">{message.content}</div>
            )}
          </div>
        )}
      </div>
      {hasAttachments && (
        <div className="flex flex-col gap-2">
          {attachments.map((attachment: any, index: number) => (
            <div key={index} className="flex flex-col gap-1">
              {attachment.contentType?.startsWith("image/") ? (
                <div className="relative max-w-sm">
                  <Image
                    alt={attachment.pathname || `Attachment ${index + 1}`}
                    className="rounded-lg"
                    src={attachment.url}
                    width={100}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-default-200 p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {attachment.pathname || "File attachment"}
                    </span>
                    <span className="text-xs text-default-500">
                      {attachment.contentType}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isHovering && (
        <div className="absolute right-0 top-full z-10 pt-2">
          <UserToolkit
            edit={edit}
            isShared={isShared}
            message={message.content}
            reload={reload}
            setEdit={setEdit}
          />
        </div>
      )}
    </div>
  );
});

export default UserMessage;
