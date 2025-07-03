export interface Model {
  id: number;
  name: string;
  isNew?: boolean;
  isPro?: boolean;
  icon: string;
}

export const models: Model[] = [
  {
    id: 0,
    name: "GPT-4o Mini",
    icon: "streamline-logos:openai-logo-solid",
  },
  {
    id: 1,
    name: "GPT-4.1 Mini",
    icon: "streamline-logos:openai-logo-solid",
  },
  {
    id: 3,
    name: "GPT-4.1",
    icon: "streamline-logos:openai-logo-solid",
    isPro: true,
  },

  {
    id: 4,
    name: "Gemini 2.5 Flash",
    icon: "ri:gemini-fill",
  },
  {
    id: 5,
    name: "Gemini 2.5 Pro",
    icon: "ri:gemini-fill",
    isNew: true,
  },
  {
    id: 6,
    name: "Grok 3 Mini",
    icon: "token:xai",
  },
  {
    id: 7,
    name: "Grok 3",
    icon: "token:xai",
    isPro: true,
  },
  {
    id: 8,
    name: "OpenAI o4-mini",
    icon: "streamline-logos:openai-logo-solid",
    isPro: true,
  },
  {
    id: 9,
    name: "DeepSeek V3",
    icon: "simple-icons:deepgram",
  },
  {
    id: 10,
    name: "DeepSeek R1",
    icon: "simple-icons:deepgram",
    isPro: true,
  },

  {
    id: 12,
    name: "Qwen 3",
    icon: "simple-icons:deepl",
    isNew: true,
  },
  {
    id: 13,
    name: "OpenAI 4o",
    icon: "streamline-logos:openai-logo-solid",
    isPro: true,
  },
];
