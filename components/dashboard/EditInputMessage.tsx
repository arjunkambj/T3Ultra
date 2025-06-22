import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";

export default function EditInput({
  message,
  setEdit,
  messageId,
}: {
  message: string;
  setEdit: (edit: boolean) => void;
  messageId: string;
}) {
  const handleCancel = () => {
    setEdit(false);
  };

  const [newMessage, setNewMessage] = useState(message);

  return (
    <form className="flex w-full flex-col gap-2">
      <Textarea
        key={messageId}
        className="w-full"
        placeholder="Enter your new message"
        value={newMessage}
        variant="bordered"
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <div className="flex w-full justify-end gap-2">
        <Button type="button" variant="bordered" onPress={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Send Message</Button>
      </div>
    </form>
  );
}
