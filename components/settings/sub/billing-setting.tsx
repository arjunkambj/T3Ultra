"use client";

import * as React from "react";
import { Button } from "@heroui/button";
import { RadioGroup } from "@heroui/radio";
import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react/dist/offline";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { cn } from "@heroui/theme";
import { useMutation } from "convex/react";
import { addToast } from "@heroui/toast";

import { PlanCustomRadio } from "./plan-custom-radio";

import { useUser } from "@/hooks/useUser";
import { api } from "@/convex/_generated/api";

interface BillingSettingCardProps {
  className?: string;
}

const BillingSetting = React.memo(
  React.forwardRef<HTMLDivElement, BillingSettingCardProps>(
    ({ className, ...props }, ref) => {
      const user = useUser();
      const [selectedPlan, setSelectedPlan] = React.useState<string>("");
      const [isLoading, setIsLoading] = React.useState(false);

      const updateSubscription = useMutation(
        api.function.users.updateSubscribtion,
      );

      React.useEffect(() => {
        if (user?.subscriptionTier) {
          setSelectedPlan(user.subscriptionTier.toLowerCase());
        } else {
          setSelectedPlan("free");
        }
      }, [user]);

      const handlePlanChange = React.useCallback((value: string) => {
        setSelectedPlan(value);
      }, []);

      const handleUpgrade = React.useCallback(async () => {
        if (
          !user?._id ||
          selectedPlan === (user.subscriptionTier?.toLowerCase() || "free")
        ) {
          return;
        }

        setIsLoading(true);
        try {
          const tierMap: { [key: string]: "Free" | "Plus" | "Pro" } = {
            free: "Free",
            plus: "Plus",
            pro: "Pro",
          };

          await updateSubscription({
            data: {
              subscriptionTier: tierMap[selectedPlan],
            },
          });

          addToast({
            title: "Plan Updated",
            description: `Successfully updated to ${tierMap[selectedPlan]} plan.`,
            color: "success",
            timeout: 3000,
          });
        } catch (error) {
          void error;
          addToast({
            title: "Error",
            description: "Failed to update subscription. Please try again.",
            color: "danger",
            timeout: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }, [user, selectedPlan, updateSubscription]);

      const getCurrentPlanInfo = React.useCallback((): {
        name: string;
        status: string;
        color:
          | "default"
          | "success"
          | "warning"
          | "primary"
          | "secondary"
          | "danger";
      } => {
        const currentTier = user?.subscriptionTier || "Free";
        const isSubscribed = user?.isSubscribed || false;

        if (currentTier === "Free") {
          return {
            name: "Free Plan",
            status: "Active",
            color: "default",
          };
        }

        return {
          name: `${currentTier} Plan`,
          status: isSubscribed ? "Active" : "Expired",
          color: isSubscribed ? "success" : "warning",
        };
      }, [user]);

      const planInfo = React.useMemo(
        () => getCurrentPlanInfo(),
        [getCurrentPlanInfo],
      );

      const isCurrentPlan = React.useMemo(
        () =>
          selectedPlan === (user?.subscriptionTier?.toLowerCase() || "free"),
        [selectedPlan, user?.subscriptionTier],
      );

      return (
        <div ref={ref} className={cn("p-4", className)} {...props}>
          {/* Current Plan Status */}
          <div>
            <p className="text-base font-medium text-default-700">
              Current Plan
            </p>

            <Card className="mt-4 bg-default-100" shadow="none">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      className="h-6 w-6 text-primary-500"
                      icon="mdi:crown"
                    />
                    <div>
                      <p className="text-sm font-medium text-default-600">
                        {planInfo.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Chip color={planInfo.color} size="sm" variant="flat">
                          {planInfo.status}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Spacer y={6} />

          {/* Plan Selection */}
          <div>
            <p className="text-base font-medium text-default-700">
              Available Plans
            </p>

            <RadioGroup
              className="mt-4"
              classNames={{
                wrapper: "gap-4 flex-col md:flex-row",
              }}
              value={selectedPlan}
              onValueChange={handlePlanChange}
            >
              <PlanCustomRadio
                classNames={{
                  label: "text-default-500 font-medium",
                }}
                description="Perfect for getting started"
                value="free"
              >
                <div className="mt-2">
                  <p className="pt-2">
                    <span className="text-[30px] font-semibold leading-7 text-default-foreground">
                      Free
                    </span>
                  </p>
                  <ul className="mt-2 list-inside list-disc text-xs font-normal text-default-500">
                    <li>Basic AI chat functionality</li>
                    <li>Limited conversations per day</li>
                    <li>Standard response time</li>
                    <li>Community support</li>
                  </ul>
                </div>
              </PlanCustomRadio>

              <PlanCustomRadio
                classNames={{
                  label: "text-default-500 font-medium",
                }}
                description="Enhanced features for power users"
                value="plus"
              >
                <div className="mt-2">
                  <p className="pt-2">
                    <span className="text-[30px] font-semibold leading-7 text-default-foreground">
                      $15
                    </span>
                    &nbsp;
                    <span className="text-xs font-medium text-default-400">
                      /per month
                    </span>
                  </p>
                  <ul className="mt-2 list-inside list-disc text-xs font-normal text-default-500">
                    <li>Unlimited conversations</li>
                    <li>Priority response time</li>
                    <li>Advanced AI models</li>
                    <li>Email support</li>
                    <li>Custom memory settings</li>
                  </ul>
                </div>
              </PlanCustomRadio>

              <PlanCustomRadio
                classNames={{
                  label: "text-default-500 font-medium",
                }}
                description="Professional features for teams"
                value="pro"
              >
                <div className="mt-2">
                  <p className="pt-2">
                    <span className="text-[30px] font-semibold leading-7 text-default-foreground">
                      $25
                    </span>
                    &nbsp;
                    <span className="text-xs font-medium text-default-400">
                      /per month
                    </span>
                  </p>
                  <ul className="mt-2 list-inside list-disc text-xs font-normal text-default-500">
                    <li>Everything in Plus</li>
                    <li>Advanced AI agents</li>
                    <li>Project management tools</li>
                    <li>Priority support</li>
                    <li>Team collaboration features</li>
                    <li>API access</li>
                  </ul>
                </div>
              </PlanCustomRadio>
            </RadioGroup>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              isDisabled={isCurrentPlan}
              isLoading={isLoading}
              onPress={handleUpgrade}
            >
              {isLoading
                ? "Updating..."
                : isCurrentPlan
                  ? "Current Plan"
                  : "Update Plan"}
            </Button>
          </div>
        </div>
      );
    },
  ),
);

BillingSetting.displayName = "BillingSetting";

export default BillingSetting;
