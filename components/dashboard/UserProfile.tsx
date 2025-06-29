"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

import { useUser } from "@/hooks/useUser";

const UserProfile = React.memo(() => {
  const router = useRouter();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuthActions();

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/");
    } catch (error) {
      void error;
      // Error signing out
    } finally {
      setIsLoading(false);
    }
  }, [signOut, router]);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const userDisplayName = useMemo(() => {
    return user?.name || user?.email || "User";
  }, [user]);

  const userAvatar = useMemo(() => {
    return user?.image || "";
  }, [user]);

  const menuItems = useMemo(
    () => [
      {
        key: "profile",
        label: "Profile",
        icon: "mdi:account",
        action: () => handleNavigation("/settings"),
      },
      {
        key: "settings",
        label: "Settings",
        icon: "mdi:cog",
        action: () => handleNavigation("/settings"),
      },
      {
        key: "billing",
        label: "Billing",
        icon: "mdi:credit-card",
        action: () => handleNavigation("/settings?tab=billing"),
      },
      {
        key: "help",
        label: "Help & Support",
        icon: "mdi:help-circle",
        action: () => handleNavigation("/contact"),
      },
    ],
    [handleNavigation],
  );

  const handleMenuAction = useCallback(
    (key: React.Key) => {
      const item = menuItems.find((item) => item.key === key);

      if (item) {
        item.action();
      } else if (key === "logout") {
        handleSignOut();
      }
    },
    [menuItems, handleSignOut],
  );

  const dropdownItems = useMemo(
    () =>
      menuItems.map((item) => (
        <DropdownItem
          key={item.key}
          startContent={<Icon icon={item.icon} width={18} />}
        >
          {item.label}
        </DropdownItem>
      )),
    [menuItems],
  );

  if (!user) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="absolute right-5 top-3 cursor-pointer transition-transform hover:scale-105"
          color="primary"
          name={userDisplayName}
          size="sm"
          src={userAvatar}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User menu"
        className="w-56"
        disabledKeys={isLoading ? ["logout"] : []}
        onAction={handleMenuAction}
      >
        <DropdownSection showDivider aria-label="Profile">
          <DropdownItem
            key="user-info"
            isReadOnly
            className="h-14 gap-2"
            textValue={userDisplayName}
          >
            <div className="flex items-center gap-2">
              <Avatar name={userDisplayName} size="sm" src={userAvatar} />
              <div className="flex flex-col">
                <span className="text-small font-semibold">
                  {userDisplayName}
                </span>
                <span className="text-tiny text-default-400">{user.email}</span>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Actions">{dropdownItems}</DropdownSection>

        <DropdownSection aria-label="Danger zone">
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            startContent={
              <Icon
                className={isLoading ? "animate-spin" : ""}
                icon={isLoading ? "mdi:loading" : "mdi:logout"}
                width={18}
              />
            }
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
});

UserProfile.displayName = "UserProfile";

export default UserProfile;
