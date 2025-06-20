"use client";

import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useMutation } from "convex/react";

import { aiModelAtom } from "@/atoms/aimodel";
import { models, type Model } from "@/config/ai-model";
import { api } from "@/convex/_generated/api";

function Badge({
  children,
  color = "default",
  size = "md",
}: {
  children: React.ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
}) {
  const colorClasses = {
    default: "bg-default-100 text-default-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    danger: "bg-danger-100 text-danger-800",
  };

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 rounded",
    md: "text-sm px-2 py-1 rounded-md",
    lg: "text-base px-2.5 py-1.5 rounded-lg",
  };

  return (
    <span
      className={`inline-flex items-center font-medium ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

export default function ModelSelector() {
  const [currentModelId, setCurrentModelId] = useAtom(aiModelAtom);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const user = useQuery(api.function.users.currentUser);
  const updateUserModel = useMutation(api.function.users.updateUserModel);

  // Update selected model when currentModelId changes
  useEffect(() => {
    if (user?.lastUsedModel) {
      const model = models.find((m) => m.id === Number(user.lastUsedModel));

      if (model) {
        setSelectedModel(model);
        setCurrentModelId(model.id);
      }
    }

    if (currentModelId) {
      const model = models.find((m) => m.id === currentModelId);

      if (model) {
        setSelectedModel(model);
      }
    }
  }, [currentModelId, user]);

  const handleModelChange = (modelId: number) => {
    setCurrentModelId(modelId);

    if (user) {
      updateUserModel({
        data: {
          lastUsedModel: modelId.toString(),
        },
      });
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg">
      <Dropdown shadow="none">
        <DropdownTrigger>
          <Button
            className="w-fulljustify-between bg-[#0F0F10] px-2 text-neutral-200"
            endContent={<Icon icon="solar:alt-arrow-down-linear" width={16} />}
            variant="flat"
          >
            {selectedModel.name}
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Select AI Model"
          className="shadow-none"
          variant="flat"
          onAction={(key) => {
            const modelId = Number(key);
            const model = models.find((m) => m.id === modelId);

            if (model) {
              setSelectedModel(model);
              setCurrentModelId(model.id);
            }
          }}
        >
          <DropdownSection>
            {models.map((model) => (
              <DropdownItem
                key={model.id}
                endContent={
                  <div className="flex items-center gap-1">
                    {model.isNew && (
                      <Badge color="success" size="sm">
                        New
                      </Badge>
                    )}
                    {model.isPro && (
                      <Badge color="danger" size="sm">
                        Pro
                      </Badge>
                    )}
                  </div>
                }
                onPress={() => handleModelChange(model.id)}
              >
                <div className="flex min-h-6 items-center gap-2">
                  <Icon
                    className="text-neutral-100"
                    icon={model.icon}
                    width={18}
                  />
                  <span>{model.name}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
