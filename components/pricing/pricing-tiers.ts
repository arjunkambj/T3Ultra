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
    description: "For starters and hobbyists that want to try out.",
    features: [
      "10 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Continue Chat",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Plus,
    title: "Plus",
    description: "For small teams that have less that 10 members.",
    href: "/checkout/plus",
    mostPopular: true,
    price: {
      monthly: "$25",
      yearly: "$220",
    },
    featured: false,
    features: [
      "20 users included",
      "10 GB of storage",
      "Help center access",
      "Priority email support",
    ],
    buttonText: "Get started",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Pro,
    title: "Pro",
    href: "/checkout/pro",
    featured: true,
    mostPopular: false,
    description: "For large teams that have more than 10 members.",
    price: {
      monthly: "$45",
      yearly: "$450",
    },
    priceSuffix: "per user",
    features: [
      "50 users included",
      "30 GB of storage",
      "Help center access",
      "Phone & email support",
    ],
    buttonText: "Get started",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
