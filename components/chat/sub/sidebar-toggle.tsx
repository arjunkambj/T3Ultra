"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import { useSidebarToggle } from "@/atoms/sidebarState";

export default function SidebarToggle({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebarToggle();

  return (
    <Button
      isIconOnly
      aria-label="Toggle sidebar"
      className={className}
      variant="light"
      onPress={toggleSidebar}
    >
      <Icon
        className="text-default-800 hover:text-default-900"
        icon="mynaui:sidebar"
        width={22}
      />
    </Button>
  );
}
