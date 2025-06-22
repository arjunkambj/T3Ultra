import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  {
    key: FrequencyEnum.Yearly,
    label: "Pay Yearly",
    priceSuffix: "per year",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Free,
    title: "Free",
    price: "Free",
    href: "/chat",
    featured: false,
    mostPopular: false,
    description: "Just to get started",
    features: [
      "10 Messages per day",
      "Limited Model Access",
      "Community Support",
    ],
    buttonText: "Continue Chat",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Plus,
    title: "Plus",
    description: "For Everyday AI Joe",
    href: "/chat",
    mostPopular: true,
    price: {
      monthly: "$15",
      yearly: "$150",
    },
    featured: false,
    features: [
      "10k Credits per month",
      "All Models Access",
      "Agents and Projects",
    ],
    buttonText: "Get started",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Pro,
    title: "Pro",
    href: "/chat",
    featured: true,
    mostPopular: false,
    description: "For Super Users",
    price: {
      monthly: "$35",
      yearly: "$350",
    },
    priceSuffix: "per user",
    features: [
      "25k Credits per month",
      "All Models Access",
      "Advanced Agents and Projects",
    ],
    buttonText: "Get started",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
