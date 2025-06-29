"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";

export default function UserProfile() {
  const user = useUser();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    router.push("/chat");
  };

  return (
    <Dropdown placement="bottom-end" shadow="none">
      <DropdownTrigger className="absolute right-4 top-2">
        <Button
          fullWidth
          isIconOnly
          className="flex items-center justify-center rounded-[14px] bg-transparent"
        >
          <Avatar size="sm" src={user?.image} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        className="w-[210px] bg-content1 px-[8px] py-[8px]"
        variant="flat"
      >
        <DropdownItem key="profile" className="h-14">
          <div className="flex w-full items-center gap-3">
            <Avatar size="sm" src={user?.image} />
            <div className="flex flex-col text-left">
              <p className="text-small font-normal leading-5 text-foreground">
                {user?.name}
              </p>
            </div>
          </div>
        </DropdownItem>
        <DropdownSection
          showDivider
          aria-label="profile-section-1"
          className="px-0"
        >
          <DropdownItem
            key="my-plan"
            as={Link}
            className="py-[4px] text-default-800"
            href="/pricing"
          >
            My Plan
          </DropdownItem>

          <DropdownItem
            key="customize-acmeai"
            as={Link}
            className="py-[4px] text-default-800"
            href="/agent/create"
          >
            Customize AI
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider aria-label="profile-section-2">
          <DropdownItem
            key="settings"
            as={Link}
            className="py-[4px] text-default-800"
            href="/settings"
          >
            Settings
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="profile-section-3" className="mb-0">
          <DropdownItem
            key="help-and-feedback"
            as={Link}
            className="py-[4px] text-default-800"
            href="/feedback"
          >
            Help & Feedback
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="pt-[4px] text-default-800"
            onPress={handleLogout}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
