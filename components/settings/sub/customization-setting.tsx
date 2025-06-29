"use client";

import * as React from "react";
import { Icon } from "@iconify/react/dist/offline";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Chip } from "@heroui/chip";
import { cn } from "@heroui/theme";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { addToast } from "@heroui/toast";

import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";

interface CustomizationSettingCardProps {
  className?: string;
}

const traitOptions = [
  "Friendly",
  "Professional",
  "Concise",
  "Detailed",
  "Creative",
  "Analytical",
  "Supportive",
  "Direct",
  "Patient",
  "Enthusiastic",
];

const preferenceOptions = [
  "Code Examples",
  "Step-by-step guides",
  "Visual explanations",
  "Quick answers",
  "In-depth analysis",
  "Multiple perspectives",
  "Practical applications",
  "Theoretical background",
];

const CustomizationSetting = React.memo(
  React.forwardRef<HTMLDivElement, CustomizationSettingCardProps>(
    ({ className, ...props }, ref) => {
      const user = useUser();
      const [isLoading, setIsLoading] = React.useState(false);
      const [formData, setFormData] = React.useState({
        whattocalluser: "",
        whatuserdoes: "",
        traitsforllm: [] as string[],
        anythingelse: "",
        preferencesofuser: [] as string[],
      });

      const customization = useQuery(
        api.function.customizations.getCustomization,
        user?._id ? { userId: user._id } : "skip",
      );
      const addCustomizationMutation = useMutation(
        api.function.customizations.addCustomization,
      );
      const updateCustomizationMutation = useMutation(
        api.function.customizations.updateCustomization,
      );

      React.useEffect(() => {
        if (customization) {
          setFormData({
            whattocalluser: customization.whattocalluser || "",
            whatuserdoes: customization.whatuserdoes || "",
            traitsforllm: customization.traitsforllm || [],
            anythingelse: customization.anythingelse || "",
            preferencesofuser: customization.preferencesofuser || [],
          });
        }
      }, [customization]);

      const handleSave = React.useCallback(async () => {
        if (!user?._id) return;

        setIsLoading(true);
        try {
          if (customization) {
            await updateCustomizationMutation({
              customizationId: customization._id,
              ...formData,
            });
          } else {
            await addCustomizationMutation({
              userId: user._id,
              ...formData,
            });
          }

          addToast({
            title: "Customization Saved",
            description: "Your AI customization preferences have been updated.",
            color: "success",
            timeout: 3000,
          });
        } catch (error) {
          void error;
          addToast({
            title: "Error",
            description: "Failed to save customization. Please try again.",
            color: "danger",
            timeout: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }, [
        user,
        formData,
        customization,
        addCustomizationMutation,
        updateCustomizationMutation,
      ]);

      const toggleTrait = React.useCallback((trait: string) => {
        setFormData((prev) => ({
          ...prev,
          traitsforllm: prev.traitsforllm.includes(trait)
            ? prev.traitsforllm.filter((t) => t !== trait)
            : [...prev.traitsforllm, trait],
        }));
      }, []);

      const togglePreference = React.useCallback((preference: string) => {
        setFormData((prev) => ({
          ...prev,
          preferencesofuser: prev.preferencesofuser.includes(preference)
            ? prev.preferencesofuser.filter((p) => p !== preference)
            : [...prev.preferencesofuser, preference],
        }));
      }, []);

      const handleInputChange = React.useCallback(
        (field: string, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
      );

      const traitChips = React.useMemo(
        () =>
          traitOptions.map((trait) => (
            <Chip
              key={trait}
              className={`cursor-pointer px-2 transition-colors ${
                formData.traitsforllm.includes(trait)
                  ? "bg-neutral-100 text-neutral-800"
                  : "border-neutral-600 bg-transparent text-neutral-400 hover:border-neutral-500"
              }`}
              variant="bordered"
              onClick={() => toggleTrait(trait)}
            >
              {trait}
            </Chip>
          )),
        [formData.traitsforllm, toggleTrait],
      );

      const preferenceChips = React.useMemo(
        () =>
          preferenceOptions.map((preference) => (
            <Chip
              key={preference}
              className={`cursor-pointer px-2 transition-colors ${
                formData.preferencesofuser.includes(preference)
                  ? "bg-neutral-100 text-neutral-800"
                  : "border-neutral-600 bg-transparent text-neutral-400 hover:border-neutral-500"
              }`}
              variant="bordered"
              onClick={() => togglePreference(preference)}
            >
              {preference}
            </Chip>
          )),
        [formData.preferencesofuser, togglePreference],
      );

      const hasCustomization = React.useMemo(
        () =>
          formData.whattocalluser ||
          formData.whatuserdoes ||
          formData.traitsforllm.length > 0 ||
          formData.preferencesofuser.length > 0 ||
          formData.anythingelse,
        [formData],
      );

      return (
        <div ref={ref} className={cn("p-2", className)} {...props}>
          {/* Personal Information */}
          <div>
            <p className="text-base font-medium text-default-700">
              Personal Information
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Help the AI understand how to address you and your context.
            </p>

            <div className="mt-4 space-y-4">
              <Input
                label="What should I call you?"
                placeholder="e.g., Alex, Dr. Smith, or your preferred name"
                value={formData.whattocalluser}
                onChange={(e) =>
                  handleInputChange("whattocalluser", e.target.value)
                }
              />

              <Textarea
                classNames={{
                  input: cn("min-h-[80px]"),
                }}
                label="What do you do?"
                placeholder="e.g., I'm a software developer working on web applications, or I'm a student studying computer science..."
                value={formData.whatuserdoes}
                onChange={(e) =>
                  handleInputChange("whatuserdoes", e.target.value)
                }
              />
            </div>
          </div>

          <Spacer y={6} />

          {/* AI Personality Traits */}
          <div>
            <p className="text-base font-medium text-default-700">
              AI Personality Traits
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Select traits you&apos;d like the AI to exhibit when interacting
              with you.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">{traitChips}</div>
          </div>

          <Spacer y={6} />

          {/* User Preferences */}
          <div>
            <p className="text-base font-medium text-default-700">
              Response Preferences
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Choose how you prefer the AI to structure its responses.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">{preferenceChips}</div>
          </div>

          <Spacer y={6} />

          {/* Additional Context */}
          <div>
            <p className="text-base font-medium text-default-700">
              Anything Else?
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Share any additional context, preferences, or special
              instructions.
            </p>

            <Textarea
              className="mt-4"
              classNames={{
                input: cn("min-h-[100px]"),
              }}
              placeholder="e.g., I prefer examples in Python, I work in healthcare, I'm learning about machine learning..."
              value={formData.anythingelse}
              onChange={(e) =>
                handleInputChange("anythingelse", e.target.value)
              }
            />
          </div>

          <Spacer y={6} />

          {/* Current Customization Preview */}
          {hasCustomization && (
            <div>
              <p className="text-base font-medium text-default-700">
                Customization Preview
              </p>
              <p className="mt-1 text-sm font-normal text-default-400">
                Here&apos;s how your customization will influence AI responses.
              </p>

              <Card className="mt-4 bg-default-100" shadow="none">
                <CardBody className="p-4">
                  <div className="space-y-3 text-sm">
                    {formData.whattocalluser && (
                      <div>
                        <span className="font-medium text-default-600">
                          Name:{" "}
                        </span>
                        <span className="text-default-500">
                          {formData.whattocalluser}
                        </span>
                      </div>
                    )}
                    {formData.whatuserdoes && (
                      <div>
                        <span className="font-medium text-default-600">
                          Role:{" "}
                        </span>
                        <span className="text-default-500">
                          {formData.whatuserdoes}
                        </span>
                      </div>
                    )}
                    {formData.traitsforllm.length > 0 && (
                      <div>
                        <span className="font-medium text-default-600">
                          AI Traits:{" "}
                        </span>
                        <span className="text-default-500">
                          {formData.traitsforllm.join(", ")}
                        </span>
                      </div>
                    )}
                    {formData.preferencesofuser.length > 0 && (
                      <div>
                        <span className="font-medium text-default-600">
                          Preferences:{" "}
                        </span>
                        <span className="text-default-500">
                          {formData.preferencesofuser.join(", ")}
                        </span>
                      </div>
                    )}
                    {formData.anythingelse && (
                      <div>
                        <span className="font-medium text-default-600">
                          Additional:{" "}
                        </span>
                        <span className="text-default-500">
                          {formData.anythingelse}
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          <Spacer y={6} />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              isLoading={isLoading}
              size="md"
              startContent={<Icon icon="mdi:content-save" width={18} />}
              variant="flat"
              onPress={handleSave}
            >
              Save Customization
            </Button>
          </div>
        </div>
      );
    },
  ),
);

CustomizationSetting.displayName = "CustomizationSetting";

export default CustomizationSetting;
