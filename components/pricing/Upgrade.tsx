import { Button } from "@heroui/button";
import Link from "next/link";

export default function Upgrade() {
  return (
    <Button
      as={Link}
      className="absolute left-1/2 top-3 z-10 h-8 rounded-full bg-neutral-800 text-neutral-100"
      href="/pricing"
      variant="flat"
    >
      Get Plus
    </Button>
  );
}
