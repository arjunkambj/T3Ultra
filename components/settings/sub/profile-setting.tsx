"use client";

import * as React from "react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { cn } from "@heroui/theme";
import { Input, Textarea } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { addToast } from "@heroui/toast";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { useUser } from "@/hooks/useUser";
import { api } from "@/convex/_generated/api";

interface ProfileSettingCardProps {
  className?: string;
}

const ProfileSetting = React.memo(
  React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
    ({ className, ...props }, ref) => {
      const user = useUser();
      const [isLoading, setIsLoading] = React.useState(false);
      const [formData, setFormData] = React.useState({
        name: "",
        title: "",
        location: "",
        biography: "",
      });

      // Get user customizations
      const customizations = useQuery(
        api.function.customizations.getCustomization,
        user?._id ? { userId: user._id } : "skip",
      );

      // Mutations
      const updateProfile = useMutation(api.function.users.updateProfile);
      const addCustomization = useMutation(
        api.function.customizations.addCustomization,
      );
      const updateCustomization = useMutation(
        api.function.customizations.updateCustomization,
      );

      React.useEffect(() => {
        if (user) {
          setFormData({
            name: user.name || "",
            title: customizations?.whatuserdoes || "",
            location: "",
            biography: customizations?.anythingelse || "",
          });
        }
      }, [user, customizations]);

      const handleSave = React.useCallback(async () => {
        if (!user?._id) return;

        setIsLoading(true);
        try {
          // Update user name in users table
          if (formData.name !== user.name) {
            await updateProfile({
              data: {
                name: formData.name,
              },
            });
          }

          // Update or create customizations
          if (customizations?._id) {
            await updateCustomization({
              customizationId: customizations._id,
              whattocalluser: customizations.whattocalluser,
              whatuserdoes: formData.title,
              traitsforllm: customizations.traitsforllm,
              anythingelse: formData.biography,
              preferencesofuser: customizations.preferencesofuser,
            });
          } else {
            await addCustomization({
              userId: user._id,
              whatuserdoes: formData.title,
              anythingelse: formData.biography,
            });
          }

          addToast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
            color: "success",
            timeout: 3000,
          });
        } catch (error) {
          void error;
          addToast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            color: "danger",
            timeout: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }, [
        user,
        formData,
        customizations,
        updateProfile,
        addCustomization,
        updateCustomization,
      ]);

      const handleInputChange = React.useCallback(
        (field: string, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
      );

      return (
        <div ref={ref} className={cn("p-2", className)} {...props}>
          {/* Profile */}
          <div>
            <p className="text-base font-medium text-default-700">Profile</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              This displays your public profile on the site.
            </p>
            <Card className="mt-4 bg-default-100" shadow="none">
              <CardBody>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16" src={user?.image || ""} />

                  <div>
                    <p className="text-sm font-medium text-default-600">
                      {user?.name || "User Name"}
                    </p>
                    <p className="mt-1 text-xs text-default-400">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <Spacer y={4} />

          {/* Name */}
          <div>
            <p className="text-base font-medium text-default-700">
              Display Name
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              This is your display name that others will see.
            </p>
            <Input
              className="mt-2"
              placeholder="Enter your display name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <Spacer y={4} />

          {/* Title */}
          <div>
            <p className="text-base font-medium text-default-700">Title</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Set your current role or what you do.
            </p>
            <Input
              className="mt-2"
              placeholder="e.g. Software Developer, Designer, Student"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <Spacer y={4} />

          {/* Biography */}
          <div>
            <p className="text-base font-medium text-default-700">Biography</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Tell us a bit about yourself. This helps the AI understand you
              better.
            </p>
            <Textarea
              className="mt-2"
              classNames={{
                input: cn("min-h-[115px]"),
              }}
              placeholder="e.g., 'I'm a passionate developer who loves building innovative solutions. I enjoy working with modern technologies and solving complex problems.'"
              value={formData.biography}
              onChange={(e) => handleInputChange("biography", e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="px-6"
              color="primary"
              isLoading={isLoading}
              onPress={handleSave}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      );
    },
  ),
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
