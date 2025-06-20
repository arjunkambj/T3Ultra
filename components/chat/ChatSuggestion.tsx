import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

const suggestions = [
  {
    id: "code",
    label: "Write Code For",
    icon: "solar:code-linear",
  },
  {
    id: "btc-price",
    label: "Check BTC Price",
    icon: "lucide:bitcoin",
  },
  {
    id: "search",
    label: "Search",
    icon: "lucide:search",
  },
  {
    id: "make-plan",
    label: "Make a Plan For",
    icon: "solar:checklist-linear",
  },
];

const features = [
  {
    id: "1",
    label:
      "- Attachtment, Image Generation & Auto Web Search, Perplexity Search",
  },
  {
    id: "2",
    label: "- Cool Markdown, Syntax Hightlight, Agents & Projects",
  },
  {
    id: "3",
    label: "- Stop, Branching & Sharing Chat",
  },
];

type ChatSuggestion = (typeof suggestions)[number];

interface ChatSuggestionsProps {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatSuggestions({ setPrompt }: ChatSuggestionsProps) {
  const handleSuggestionSelect = (suggestion: ChatSuggestion) => {
    setPrompt(`Help me ${suggestion.label.toLowerCase()}`);
  };

  return (
    <div className="pb-15 mb-24 flex w-full max-w-3xl flex-col py-8">
      {/* Main heading */}
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-neutral-300">
            Welcome to the T1 GPT.
          </h1>

          {/* Action buttons */}
          <div className="flex justify-start gap-1">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                className="border border-neutral-800 bg-neutral-900"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <Icon icon={suggestion.icon} />
                <span>{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sample questions */}
        <div className="w-full max-w-3xl space-y-3 pl-2">
          {features.map((feature) => (
            <div key={feature.id}>
              <div className="mb-2 px-2 text-sm text-neutral-400">
                {feature.label}
              </div>
              <Divider className="bg-neutral-800" />
            </div>
          ))}
          <div className="mb-2 px-2 text-sm text-neutral-400">
            - Auto Memory, Source & Context
          </div>
        </div>
      </div>
    </div>
  );
}
