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
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0A]">
      <Link
        className="ransition-transform group absolute left-4 top-5 flex items-center gap-2 text-sm font-medium text-default-600 transition-all duration-200 hover:text-danger group-hover:-translate-x-1"
        href="/chat"
      >
        <Icon
          className="t ransition-transform text-lg duration-200 group-hover:-translate-x-1"
          icon="mdi:arrow-left"
        />
        <span className="ransition-transform duration-200 group-hover:-translate-x-1">
          Back to Chat
        </span>
      </Link>
      <Price />
    </div>
  );
}
