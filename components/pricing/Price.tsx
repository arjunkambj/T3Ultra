"use client";

import React, { useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spacer } from "@heroui/spacer";
import { Tab, Tabs } from "@heroui/tabs";
import { cn } from "@heroui/theme";

import { FrequencyEnum } from "./pricing-types";
import { frequencies, tiers } from "./pricing-tiers";

interface PriceCardProps {
  tier: any; // Using any since the original tier structure is different
  isPopular?: boolean;
  onSelect?: (tier: any) => void;
  isSelected?: boolean;
  className?: string;
}

const PriceCard = React.memo<PriceCardProps>(
  ({ tier, isPopular = false, onSelect, isSelected = false, className }) => {
    const handleSelect = useCallback(() => {
      if (onSelect) {
        onSelect(tier);
      }
    }, [onSelect, tier]);

    const featureItems = useMemo(
      () =>
        tier.features?.map((feature: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <Icon
              className="mt-0.5 text-success"
              icon="mdi:check-circle"
              width={16}
            />
            <span className="text-sm text-default-600">{feature}</span>
          </div>
        )) || [],
      [tier.features],
    );

    const cardClasses = useMemo(
      () =>
        cn(
          "relative h-full transition-all duration-200",
          {
            "border-2 border-primary shadow-lg": isSelected,
            "border border-default-200": !isSelected,
            "scale-105": isPopular,
          },
          className,
        ),
      [isSelected, isPopular, className],
    );

    const buttonVariant = useMemo(() => {
      if (tier.price === 0) return "flat";

      return isSelected || isPopular ? "solid" : "bordered";
    }, [tier.price, isSelected, isPopular]);

    const buttonColor = useMemo(() => {
      if (tier.price === 0) return "default";

      return isPopular ? "primary" : "default";
    }, [tier.price, isPopular]);

    return (
      <Card className={cardClasses}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Chip
              className="bg-gradient-to-r from-primary to-secondary text-white"
              size="sm"
              startContent={<Icon icon="mdi:star" width={14} />}
            >
              Most Popular
            </Chip>
          </div>
        )}

        <CardHeader className="flex flex-col items-start gap-2 pb-4">
          <div className="flex w-full items-center justify-between">
            <h3 className="text-lg font-semibold text-default-900">
              {tier.name}
            </h3>
            {tier.badge && (
              <Chip
                className="bg-success/10 text-success"
                size="sm"
                variant="flat"
              >
                {tier.badge}
              </Chip>
            )}
          </div>
          <p className="text-sm text-default-500">{tier.description}</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 pt-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-default-900">
              ${tier.price}
            </span>
            <span className="text-sm text-default-500">
              {tier.price > 0 ? "/month" : "forever"}
            </span>
          </div>

          <div className="flex flex-col gap-3">{featureItems}</div>

          {tier.limitations && tier.limitations.length > 0 && (
            <div className="mt-2 border-t border-default-100 pt-3">
              <p className="mb-2 text-xs font-medium text-default-400">
                Limitations:
              </p>
              <div className="flex flex-col gap-1">
                {tier.limitations.map((limitation: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon
                      className="mt-0.5 text-warning"
                      icon="mdi:minus-circle"
                      width={14}
                    />
                    <span className="text-xs text-default-400">
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>

        <CardFooter className="pt-0">
          <Button
            fullWidth
            className={cn({
              "bg-gradient-to-r from-primary to-secondary text-white":
                isPopular && !isSelected,
            })}
            color={buttonColor}
            size="lg"
            variant={buttonVariant}
            onPress={handleSelect}
          >
            {tier.price === 0 ? "Get Started" : "Choose Plan"}
          </Button>
        </CardFooter>
      </Card>
    );
  },
);

PriceCard.displayName = "PriceCard";

export default function Component() {
  const [, setSelectedFrequency] = React.useState(frequencies[0]);

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
        <h2 className="font-medium leading-7 text-primary">Pricing</h2>
        <h1 className="text-4xl font-medium tracking-tight">
          Subscribe to More Credits
        </h1>
      </div>
      <Spacer y={6} />
      <Tabs
        classNames={{
          tabList: "bg-default-100/70 rounded-2xl",
          cursor: "bg-primary-500 dark:bg-default-200/30",
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
              <Chip color="primary" variant="flat">
                Save 20%
              </Chip>
            </div>
          }
        />
      </Tabs>
      <Spacer y={12} />
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <PriceCard
            key={tier.key}
            isPopular={tier.mostPopular}
            tier={tier}
            onSelect={(_selectedTier) => {
              // Handle tier selection
            }}
          />
        ))}
      </div>
      <Spacer y={12} />
    </div>
  );
}
