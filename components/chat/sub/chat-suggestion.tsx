import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

const suggestions = [
  {
    id: "code",
    label: "Code",
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
    label: "Make a plan",
    icon: "solar:checklist-linear",
  },
];

const features = [
  {
    id: "1",
    label: "- Attachtment, Image Support & Auto Web Search",
  },
  {
    id: "2",
    label: "- Cool Markdown, Syntax Hightlight",
  },
  {
    id: "3",
    label: "- Stop, Resume Streams and sharing & Branching chats",
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
    <div className="w-full max-w-3xl py-8 flex flex-col w-full mb-24 pb-20">
      {/* Main heading */}
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl text-neutral-200 font-bold">
            How can I help you, Arjun?
          </h1>

          {/* Action buttons */}
          <div className="flex justify-start gap-1">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                radius="full"
                size="sm"
                variant="flat"
                className="bg-neutral-900 border border-neutral-800"
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <Icon icon={suggestion.icon} />
                <span>{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sample questions */}
        <div className="space-y-3 pl-2 max-w-3xl w-full">
          {features.map((feature) => (
            <div key={feature.id}>
              <div className="mb-2 px-2 text-neutral-300">{feature.label}</div>
              <Divider className="bg-neutral-800" />
            </div>
          ))}
          <div className="mb-2 px-2 text-neutral-300">
            - Auto Web Search, Crpto Tool, & Perplexity Search
          </div>
        </div>
      </div>
    </div>
  );
}
