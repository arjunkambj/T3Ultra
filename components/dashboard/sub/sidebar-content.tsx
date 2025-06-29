"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useRouter } from "next/navigation";
import { Unauthenticated, Authenticated } from "convex/react";
import { usePathname } from "next/navigation";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";

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

  const handleNewChat = useCallback(() => {
    router.push(`/chat`);
    if (onClose) {
      onClose();
    }
  }, [router, onClose]);

  const containerClasses = useMemo(
    () =>
      `relative flex h-dvh max-w-[250px] flex-1 flex-col overflow-hidden transition-all bg-gradient-to-b from-[#0f0f0f] via-[#131313] to-[#171717] duration-300 ease-in-out ${
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
          <Icon
            className="text-neutral-300"
            icon="solar:close-circle-line-duotone"
            width={24}
          />
        </Button>
      </div>
    ),
    [onClose],
  );

  const agentsSection = useMemo(
    () => (
      <Authenticated>
        <div className="space-y-2">
          <Tooltip
            showArrow
            closeDelay={0}
            content="Create and manage your AI agents"
            placement="right"
          >
            <Button
              fullWidth
              as={Link}
              className="mb-1 flex h-9 justify-start rounded-lg bg-transparent px-3 text-neutral-300 transition-colors hover:bg-neutral-800/50 hover:text-neutral-100"
              href="/agent"
              startContent={
                <Icon
                  className="text-neutral-200"
                  icon="mdi:robot"
                  width={18}
                />
              }
            >
              <span className="text-sm">Manage Agents</span>
            </Button>
          </Tooltip>
          <SidebarAgentsList />
        </div>
      </Authenticated>
    ),
    [],
  );

  const projectsSection = useMemo(
    () => (
      <Authenticated>
        <div className="space-y-1">
          <Tooltip
            showArrow
            closeDelay={0}
            content="Keep Chat organized with Projects"
            placement="right"
          >
            <Button
              fullWidth
              as={Link}
              className={`mb-2 flex h-9 justify-start rounded-lg bg-transparent px-3 text-neutral-300 transition-colors hover:bg-neutral-800/50 hover:text-neutral-100 ${
                pathname === "/project"
                  ? "bg-neutral-800/50 text-neutral-100"
                  : ""
              }`}
              href="/project"
              startContent={
                <Icon
                  className="text-neutral-200"
                  icon="mdi:folder-plus"
                  width={18}
                />
              }
            >
              <span className="text-sm">Create Project</span>
            </Button>
          </Tooltip>
          <SidebarProjectsList />
        </div>
      </Authenticated>
    ),
    [pathname],
  );

  const newChatButton = useMemo(
    () => (
      <Button
        fullWidth
        className="rounded-full bg-default-100 py-4"
        onPress={handleNewChat}
      >
        New Chat
      </Button>
    ),
    [handleNewChat],
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
              className="text-neutral-300"
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

  const scrollableContent = useMemo(
    () => (
      <ScrollShadow hideScrollBar className="flex-1 pr-2" size={20}>
        <div className="space-y-2">
          {/* Projects Section */}
          {projectsSection}

          <Spacer y={2} />

          {/* Chat History Section */}
          <ChatHistory />
        </div>
      </ScrollShadow>
    ),
    [projectsSection],
  );

  return (
    <div className={containerClasses}>
      {/* Logo and Close Button */}
      {logoSection}

      <Spacer y={4} />

      {/* New Chat Button */}
      {newChatButton}

      <Spacer y={4} />

      {/* Middle Section - Agents, Projects, and Chat History */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Agents Section */}
        {agentsSection}

        {/* Divider - only show if we have agents */}
        <Authenticated>
          <div className="py-2">
            <Divider className="bg-neutral-800/50" />
          </div>
        </Authenticated>

        {/* Projects and Chat History - Scrollable Area */}
        {scrollableContent}
      </div>

      <Spacer y={3} />

      <div className="mt-auto">{footerButtons}</div>
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

export default SidebarContent;
