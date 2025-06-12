import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Price from "@/components/pricing/Price";

export const metadata: Metadata = {
  title: "T3Ultra - Pricing",
  description: "Pricing for T3Ultra",
};

export default function PricingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-[#151515]">
      <Link
        className="group absolute left-4 top-5 flex items-center gap-2 text-sm font-medium text-default-600 transition-all duration-200 hover:text-primary"
        href="/chat"
      >
        <Icon
          className="text-lg transition-transform duration-200 group-hover:-translate-x-1"
          icon="mdi:arrow-left"
        />
        <span className="">Back to Chat</span>
      </Link>
      <Price />
    </div>
  );
}
