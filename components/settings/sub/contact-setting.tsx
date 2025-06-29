"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spacer } from "@heroui/spacer";
import { cn } from "@heroui/theme";

interface ContactSettingCardProps {
  className?: string;
}

const contactOptions = [
  {
    title: "Documentation",
    description: "Browse our comprehensive guides",
    icon: "mdi:book-open",
    action: "/docs",
    actionText: "View Docs",
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: "mdi:forum",
    action: "/community",
    actionText: "Join Forum",
  },
];

const socialLinks = [
  {
    name: "Twitter",
    icon: "mdi:twitter",
    url: "https://twitter.com/t1gpt",
    color: "text-blue-500",
  },
  {
    name: "Discord",
    icon: "mdi:discord",
    url: "https://discord.gg/t1gpt",
    color: "text-indigo-500",
  },
  {
    name: "GitHub",
    icon: "mdi:github",
    url: "https://github.com/t1gpt",
    color: "text-gray-500",
  },
  {
    name: "LinkedIn",
    icon: "mdi:linkedin",
    url: "https://linkedin.com/company/t1gpt",
    color: "text-blue-600",
  },
];

const ContactSetting = React.memo(
  React.forwardRef<HTMLDivElement, ContactSettingCardProps>(
    ({ className, ...props }, ref) => {
      const contactCards = React.useMemo(
        () =>
          contactOptions.map((option) => (
            <Card key={option.title} className="bg-default-100" shadow="none">
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900/80">
                    <Icon
                      className="text-neutral-300"
                      icon={option.icon}
                      width={20}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-default-600">
                      {option.title}
                    </p>
                    <p className="text-xs text-default-400">
                      {option.description}
                    </p>
                    <Button
                      as={Link}
                      className="mt-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                      href={option.action}
                      size="sm"
                      variant="flat"
                    >
                      {option.actionText}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )),
        [],
      );

      const socialButtons = React.useMemo(
        () =>
          socialLinks.map((social) => (
            <Button
              key={social.name}
              isExternal
              as={Link}
              className="bg-default-100 hover:bg-default-200"
              href={social.url}
              startContent={
                <Icon className={social.color} icon={social.icon} width={18} />
              }
              variant="flat"
            >
              {social.name}
            </Button>
          )),
        [],
      );

      return (
        <div ref={ref} className={cn("p-2", className)} {...props}>
          {/* Contact Information */}
          <div>
            <p className="text-base font-medium text-default-700">
              Contact Information
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Get in touch with our support team or find helpful resources.
            </p>

            <Card className="mt-4 bg-default-100" shadow="none">
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/80">
                    <Icon
                      className="text-neutral-300"
                      icon="mdi:headset"
                      width={24}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-default-600">
                      Support Team
                    </p>
                    <p className="text-xs text-default-400">
                      support@t1gpt.com
                    </p>
                    <p className="text-xs text-default-400">
                      Usually responds within 24 hours
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Spacer y={6} />

          {/* Support Options */}
          <div>
            <p className="text-base font-medium text-default-700">
              Support Options
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Choose the best way to get help with your questions.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contactCards}
            </div>
          </div>

          <Spacer y={6} />

          {/* Social Media */}
          <div>
            <p className="text-base font-medium text-default-700">Follow Us</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Stay updated with the latest news and updates.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">{socialButtons}</div>
          </div>

          <Spacer y={6} />

          {/* Emergency Contact */}
          <div>
            <Card
              className="border-l-4 border-l-neutral-500 bg-neutral-800/20"
              shadow="none"
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    className="text-neutral-400"
                    icon="mdi:alert-circle"
                    width={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-default-600">
                      Need Urgent Help?
                    </p>
                    <p className="text-xs text-default-400">
                      For critical issues that require immediate attention,
                      please email us at{" "}
                      <Link
                        isExternal
                        className="text-xs text-danger-500"
                        href="mailto:urgent@t1gpt.com"
                      >
                        urgent@t1gpt.com
                      </Link>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      );
    },
  ),
);

ContactSetting.displayName = "ContactSetting";

export default ContactSetting;
