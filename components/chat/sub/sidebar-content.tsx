"use client";

import React, { useMemo } from "react";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { Divider } from "@heroui/divider";

import UserProfile from "../UserProfile";

import ChatHistory from "./ChatHistory";

import ProjectsList from "@/components/project/ProjectsList";
import AgentsList from "@/components/agent/AgentsList";
import { Logo } from "@/components/Logo";
import { useSidebarToggle } from "@/atoms/sidebarState";
import SidebarModel from "@/components/auth/SidebarModel";

interface SidebarContentProps {
  onClose: () => void;
}

const SidebarContent = React.memo(({ onClose }: SidebarContentProps) => {
  const { isOpen } = useSidebarToggle();
  const router = useRouter();

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
            T3Ultra
          </span>
        </div>

        {/* Close button - only visible on mobile */}
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
      <div className="mt-auto flex flex-col gap-1">
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
        <Authenticated>
          <UserProfile />
        </Authenticated>
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

      <Spacer y={6} />

      {/* New Chat Button */}
      <Button
        fullWidth
        className="rounded-full bg-default-100 py-5"
        onPress={handleNewChat}
      >
        New Chat
      </Button>

      <Spacer y={6} />

      <div className="flex flex-col gap-0">
        <Button
          fullWidth
          className="flex justify-start rounded-full bg-transparent px-2 py-5 text-neutral-300 hover:text-neutral-100"
          startContent={
            <Icon className="text-neutral-300" icon="mdi:robot" width={20} />
          }
          onPress={handleCustomModels}
        >
          Manage Agents
        </Button>
        <Button
          fullWidth
          className="flex justify-start rounded-full bg-transparent px-2 py-5 text-neutral-300 hover:text-neutral-100"
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
      </div>

      <Divider className="mb-6 mt-4 bg-neutral-900" />

      <ProjectsList />

      <Spacer y={5} />

      <AgentsList />

      <Spacer y={5} />

      {/* Chat History */}
      <ScrollShadow hideScrollBar size={10} visibility="auto">
        <ChatHistory />
      </ScrollShadow>

      <Spacer y={8} />

      {/* Footer Buttons */}
      {footerButtons}
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

export default SidebarContent;
