"use client";

import * as React from "react";
import { Icon } from "@iconify/react/dist/offline";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Card, CardBody } from "@heroui/card";
import { cn } from "@heroui/theme";
import { Input, Textarea } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { addToast } from "@heroui/toast";

import { useUser } from "@/hooks/useUser";

interface ProfileSettingCardProps {
  className?: string;
}

const ProfileSetting = React.forwardRef<
  HTMLDivElement,
  ProfileSettingCardProps
>(({ className, ...props }, ref) => {
  const user = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    title: "",
    location: "",
    biography: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        title: "",
        location: "",
        biography: "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    try {
      // Here you would typically update the user profile
      // For now, we'll just show a success message
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
  };

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
              <Badge
                showOutline
                classNames={{
                  badge: "w-5 h-5",
                }}
                content={
                  <Button
                    isIconOnly
                    className="h-5 w-5 min-w-5 bg-background p-0 text-default-500"
                    radius="full"
                    size="sm"
                    variant="bordered"
                  >
                    <Icon className="h-[9px] w-[9px]" icon="mdi:pencil" />
                  </Button>
                }
                placement="bottom-right"
                shape="circle"
              >
                <Avatar
                  className="h-16 w-16"
                  src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg"
                />
              </Badge>
              <div>
                <p className="text-sm font-medium text-default-600">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-default-400">
                  {formData.title || "No title set"}
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
      {/* Title */}
      <div>
        <p className="text-base font-medium text-default-700">Title</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Set your current role.
        </p>
        <Input
          className="mt-2"
          placeholder="e.g Customer Support"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <Spacer y={2} />
      {/* Location */}
      <div>
        <p className="text-base font-medium text-default-700">Location</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Set your current location.
        </p>
        <Input
          className="mt-2"
          placeholder="e.g Buenos Aires, Argentina"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />
      </div>
      <Spacer y={4} />
      {/* Biography */}
      <div>
        <p className="text-base font-medium text-default-700">Biography</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Specify your present whereabouts.
        </p>
        <Textarea
          className="mt-2"
          classNames={{
            input: cn("min-h-[115px]"),
          }}
          placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
          value={formData.biography}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, biography: e.target.value }))
          }
        />
      </div>
      <Button
        className="mt-4"
        color="primary"
        isLoading={isLoading}
        size="sm"
        onPress={handleSave}
      >
        Update Profile
      </Button>
    </div>
  );
});

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
