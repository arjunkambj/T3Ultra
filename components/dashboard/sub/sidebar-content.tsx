"use client";

import React, { useMemo } from "react";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useRouter } from "next/navigation";
import { Unauthenticated, Authenticated } from "convex/react";
import { usePathname } from "next/navigation";
import { Tooltip } from "@heroui/tooltip";

import ChatHistory from "./ChatHistory";

import SidebarProjectsList from "@/components/project/SidebarProjectsList";
import SidebarAgentsList from "@/components/agent/SidebarAgentsList";
import { Logo } from "@/components/Logo";
import { useSidebarToggle } from "@/atoms/sidebarState";
import SidebarModel from "@/components/auth/SidebarModel";

interface SidebarContentProps {
  onClose: () => void;
}

const SidebarContent = React.memo(({ onClose }: SidebarContentProps) => {
  const { isOpen } = useSidebarToggle();
  const router = useRouter();
  const pathname = usePathname();
  const handleNewChat = () => {
    router.push(`/chat`);

    if (onClose) {
      onClose();
    }
  };

  const handleCustomModels = () => {
    router.push(`/agent`);

    if (onClose) {
      onClose();
    }
  };

  const handleCreateProject = () => {
    router.push(`/project`);

    if (onClose) {
      onClose();
    }
  };

  const containerClasses = useMemo(
    () =>
      `relative flex h-dvh max-w-[250px] flex-1 flex-col overflow-hidden transition-all bg-[#0A0A0A] duration-300 ease-in-out ${
        isOpen ? "w-[250px] p-6" : "w-0 p-0"
      }`,
    [isOpen],
  );

  const logoSection = useMemo(
    () => (
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <Logo className="text-neutral-950" />
          </div>
          <span className="font-semibold leading-6 text-neutral-100">
            T1 GPT
          </span>
        </div>

        <Button
          isIconOnly
          aria-label="Close sidebar"
          className="absolute right-0 top-0 sm:hidden"
          variant="light"
          onPress={onClose}
        >
          <Icon icon="solar:close-circle-line-duotone" width={24} />
        </Button>
      </div>
    ),
    [onClose],
  );

  const footerButtons = useMemo(
    () => (
      <div className="flex flex-col">
        <Button
          as={Link}
          className="justify-start text-default-800"
          href="/pricing"
          startContent={
            <Icon
              className="text-default-800"
              icon="solar:settings-minimalistic-line-duotone"
              width={24}
            />
          }
          variant="light"
        >
          Upgrade to Pro
        </Button>

        <Unauthenticated>
          <SidebarModel />
        </Unauthenticated>
      </div>
    ),
    [],
  );

  return (
    <div className={containerClasses}>
      {/* Logo and Close Button */}
      {logoSection}

      <Spacer y={4} />

      {/* New Chat Button */}
      <Button
        fullWidth
        className="rounded-full bg-default-100 py-4"
        onPress={handleNewChat}
      >
        New Chat
      </Button>

      <Spacer y={4} />

      <div className="flex flex-col gap-0">
        <Authenticated>
          <Tooltip
            showArrow
            closeDelay={0}
            content="Create and manage your AI agents"
            placement="right"
          >
            <Button
              fullWidth
              className="mb-1 flex h-8 justify-start rounded-full bg-transparent px-2 text-neutral-300 hover:bg-default-100 hover:text-neutral-100"
              startContent={
                <Icon
                  className="text-neutral-300"
                  icon="token:xai"
                  width={22}
                />
              }
              onPress={handleCustomModels}
            >
              Manage Agents
            </Button>
          </Tooltip>
        </Authenticated>
        <SidebarAgentsList />
      </div>

      {/* Chat History */}

      <ScrollShadow hideScrollBar size={10} visibility="auto">
        <Spacer y={3} />

        <Authenticated>
          <Tooltip
            showArrow
            closeDelay={0}
            content="Keep Chat orgnized with Projects"
            placement="right"
          >
            <Button
              fullWidth
              className={`mb-1 flex h-8 justify-start rounded-full bg-transparent px-2 text-neutral-300 hover:bg-default-100 hover:text-neutral-100 ${
                pathname === "/project" ? "bg-default-100 text-neutral-100" : ""
              }`}
              startContent={
                <Icon
                  className="text-neutral-300"
                  icon="mdi:folder-plus"
                  width={20}
                />
              }
              onPress={handleCreateProject}
            >
              Create Project
            </Button>
          </Tooltip>
        </Authenticated>

        <SidebarProjectsList />

        <Spacer y={4} />

        <ChatHistory />
      </ScrollShadow>

      <Spacer y={3} />

      <div className="mt-auto">{footerButtons}</div>
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

export default SidebarContent;
