"use client";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

export default function AiModels() {
  const models = [
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
    },
    {
      id: "gemini-2.5",
      name: "Gemini 2.5",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>Select Model</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSection title="Models">
          {models.map((model) => (
            <DropdownItem key={model.id}>{model.name}</DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
