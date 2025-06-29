"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import HelpAndFeedback from "@/components/contact/HelpAndFeedback";

export default function ContactPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0A]">
      <Link
        className="group absolute left-4 top-5 flex items-center gap-2 text-sm font-medium text-default-600 transition-all duration-200 hover:text-danger group-hover:-translate-x-1"
        href="/chat"
      >
        <Icon
          className="text-lg transition-transform duration-200 group-hover:-translate-x-1"
          icon="mdi:arrow-left"
        />
        <span className="transition-transform duration-200 group-hover:-translate-x-1">
          Back to Chat
        </span>
      </Link>
      <HelpAndFeedback />
    </div>
  );
}
