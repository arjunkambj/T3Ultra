export interface Model {
  id: number;
  name: string;
  capabilities: string[];
  isNew?: boolean;
  isPro?: boolean;
  icon: string;
}

export const models: Model[] = [
  {
    id: 0,
    name: "GPT-4o Mini",
    icon: "arcticons:openai-chatgpt",
    capabilities: ["Vision processing", "Fast responses", "Code generation"],
  },
  {
    id: 1,
    name: "GPT-4.1 Mini",
    icon: "arcticons:openai-chatgpt",
    capabilities: [
      "Complex problem-solving",
      "Tool usage",
      "Advanced reasoning",
    ],
    isPro: true,
  },
  {
    id: 2,
    name: "Gemini 2.0 Flash",
    icon: "ri:gemini-line",
    capabilities: [
      "Multimodal processing",
      "Fast inference",
      "Factual responses",
    ],
    isNew: true,
  },
];
