"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";

export default function AssistanceToolkit() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Tooltip content="Copy">
        <Button isIconOnly radius="md" size="sm" variant="flat">
          <Icon icon="solar:copy-outline" width={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Retry">
        <Button isIconOnly radius="md" size="sm" variant="flat">
          <Icon icon="solar:retry-outline" width={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Switch Model">
        <Button isIconOnly radius="md" size="sm" variant="flat">
          <Icon icon="solar:mode-outline" width={18} />
        </Button>
      </Tooltip>
    </div>
  );
}
