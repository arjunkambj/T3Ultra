"use client";
import * as React from "react";
import { Tab, Tabs } from "@heroui/tabs";

import ProfileSetting from "@/components/settings/sub/profile-setting";
import CustomizationSetting from "@/components/settings/sub/customization-setting";
import BillingSetting from "@/components/settings/sub/billing-setting";
import MemorySetting from "@/components/settings/sub/memory-setting";
import ContactSetting from "@/components/settings/sub/contact-setting";

export default function SettingsContent() {
  return (
    <Tabs
      classNames={{
        base: "",
        cursor: "bg-content1 dark:bg-content1",
        panel: "w-full p-0 pt-4 pb-8",
      }}
    >
      <Tab key="account" title="Account">
        <ProfileSetting />
      </Tab>
      <Tab key="customization" title="Customization">
        <CustomizationSetting />
      </Tab>
      <Tab key="memory" title="Memories">
        <MemorySetting />
      </Tab>
      <Tab key="billing" title="Billing">
        <BillingSetting />
      </Tab>
      <Tab key="contact" title="Contact Us">
        <ContactSetting />
      </Tab>
    </Tabs>
  );
}
