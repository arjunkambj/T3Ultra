"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { Tooltip } from "@heroui/tooltip";

import SidebarToggle from "./sub/sidebar-toggle";
import ModelSelector from "./sub/ai-model-selector";

import { sidebarOpenAtom } from "@/atoms/sidebarState";

export default function TopMenuBar() {
  const isOpen = useAtomValue(sidebarOpenAtom);

  return (
    <div className="absolute left-2 top-3 z-10 flex items-center gap-0 rounded-lg">
      <SidebarToggle />
      <ModelSelector />
      {!isOpen && (
        <Tooltip content="New Chat">
          <Button
            isIconOnly
            as={Link}
            className="px-0.5"
            href="/chat"
            variant="light"
          >
            <div className="flex h-full w-full items-center justify-center">
              <Icon height={22} icon={"hugeicons:plus-sign"} width={22} />
            </div>
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
