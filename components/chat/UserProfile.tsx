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
import { Skeleton } from "@heroui/skeleton";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { IconSvgProps } from "@/types";
import { useUser } from "@/hooks/useUser";

export default function UserProfile() {
  const user = useUser();
  const { signOut } = useAuthActions();

  return (
    <div className="flex flex-col gap-4">
      <Dropdown placement="bottom-end" shadow="none">
        <DropdownTrigger>
          {user ? (
            <Button
              fullWidth
              className="h-[60px] justify-start gap-3 rounded-[14px] border-1 border-default-300 bg-transparent px-3 py-[10px]"
              endContent={<AvatarDropdownIcon height={20} width={20} />}
            >
              <div className="flex w-full items-center gap-3">
                <Avatar size="sm" src={user?.image} />
                <div className="flex flex-col text-left">
                  <p className="text-small font-semibold leading-5 text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-tiny text-default-800">Free</p>
                </div>
              </div>
            </Button>
          ) : (
            <UserProfileSkeleton />
          )}
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
              href="/settings"
            >
              My Plan
            </DropdownItem>

            <DropdownItem
              key="customize-acmeai"
              as={Link}
              className="py-[4px] text-default-800"
              href="/settings"
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
              href="/settings"
            >
              Help & Feedback
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="pt-[4px] text-default-800"
              onPress={() => signOut()}
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

function AvatarDropdownIcon(props: IconSvgProps) {
  return (
    <svg
      {...props}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3076_10614)">
        <path
          d="M6.6665 7.50008L9.99984 4.16675L13.3332 7.50008"
          stroke="#A1A1AA"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3332 12.5L9.99984 15.8333L6.6665 12.5"
          stroke="#A1A1AA"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3076_10614">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="flex w-full max-w-[300px] items-center gap-3">
      <div>
        <Skeleton className="flex h-12 w-12 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
