import * as React from "react";

import SettingsView from "@/components/settings/settings-view";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <section className="h-dvh md:ml-24">
      <Button
        as={Link}
        href="/chat"
        className="absolute left-1 top-4 block bg-transparent md:hidden"
      >
        <Icon icon="mdi:arrow-left" />
      </Button>

      <SettingsView />
    </section>
  );
}
