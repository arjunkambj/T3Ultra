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
import { Tooltip } from "@heroui/tooltip";

import { aiModelAtom } from "@/atoms/aimodel";
import { models, type Model } from "@/config/ai-model";
// Custom Badge component since Chip may not be available
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

  // Update selected model when currentModelId changes
  useEffect(() => {
    const model = models.find((m) => m.id === currentModelId);

    if (model) {
      setSelectedModel(model);
    }
  }, [currentModelId]);

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
                className="py-3"
                description={
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((capability, index) => (
                        <Badge key={index} color="default" size="sm">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
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
              >
                <div className="mb-2 flex items-center">
                  <span className="mr-2">
                    <Icon icon={model.icon} width={18} />
                  </span>
                  <span className="font-medium">{model.name}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
