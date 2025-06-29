import * as React from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

import SettingsView from "@/components/settings/settings-view";

export default function SettingsPage() {
  return (
    <section className="h-dvh md:ml-24">
      <Button
        as={Link}
        className="absolute left-1 top-4 block bg-transparent md:hidden"
        href="/chat"
      >
        <Icon icon="mdi:arrow-left" />
      </Button>

      <SettingsView />
    </section>
  );
}
