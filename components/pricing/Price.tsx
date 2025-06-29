"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Spacer } from "@heroui/spacer";
import { Tab, Tabs } from "@heroui/tabs";
import { cn } from "@heroui/theme";

import { FrequencyEnum } from "./pricing-types";
import { frequencies, tiers } from "./pricing-tiers";

export default function Component() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies[0],
  );

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);

    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  return (
    <div className="relative flex max-w-4xl flex-col items-center py-12">
      <div
        aria-hidden="true"
        className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl md:right-20 md:h-auto md:w-auto md:px-36"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-neutral-400 to-neutral-500 opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium leading-7 text-neutral-100">Pricing</h2>
        <h1 className="text-4xl font-medium tracking-tight">
          Subscribe to More Credits
        </h1>
      </div>
      <Spacer y={6} />
      <Tabs
        classNames={{
          tabList: "bg-default-100/70 rounded-2xl",
          cursor: "bg-neutral-100 dark:bg-neutral-100/30",
          tab: "data-[hover-unselected=true]:opacity-90",
        }}
        radius="full"
        onSelectionChange={onFrequencyChange}
      >
        <Tab
          key={FrequencyEnum.Monthly}
          aria-label="Pay Yearly"
          className="px-3"
          title="Monthly"
        />
        <Tab
          key={FrequencyEnum.Yearly}
          title={
            <div className="flex items-center gap-2">
              <p>Pay Yearly</p>
              <Chip
                className="bg-neutral-100 text-neutral-900"
                color="default"
                variant="flat"
              >
                Save 20%
              </Chip>
            </div>
          }
        />
      </Tabs>
      <Spacer y={12} />
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            isBlurred
            className={cn(
              "bg-default-100/60 p-3 shadow-none dark:bg-default-100/50",
              {
                "!border-small border-neutral-100/50": tier.mostPopular,
              },
            )}
            shadow="md"
          >
            {tier.mostPopular ? (
              <Chip
                className="absolute right-4 top-4 bg-neutral-100 text-neutral-900"
                color="default"
                variant="flat"
              >
                Most Popular
              </Chip>
            ) : null}
            <CardHeader className="flex flex-col items-start gap-2 pb-6">
              <h2 className="text-large font-medium text-default-900">
                {tier.title}
              </h2>
              <p className="text-medium text-default-800">{tier.description}</p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-8">
              <p className="flex items-baseline gap-1 pt-2">
                <span className="inline bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-default-900">
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[selectedFrequency.key]}
                </span>
                {typeof tier.price !== "string" ? (
                  <span className="text-small font-medium text-default-900">
                    {tier.priceSuffix
                      ? `/${tier.priceSuffix}/${selectedFrequency.priceSuffix}`
                      : `/${selectedFrequency.priceSuffix}`}
                  </span>
                ) : null}
              </p>
              <ul className="flex flex-col gap-2">
                {tier.features?.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icon
                      className="text-neutral-100"
                      icon="ci:check"
                      width={24}
                    />
                    <p className="text-default-800">{feature}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                as={Link}
                className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                color="default"
                href={tier.href}
                variant={tier.buttonVariant}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={12} />
    </div>
  );
}
