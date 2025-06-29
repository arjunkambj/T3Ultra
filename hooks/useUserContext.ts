import { useQuery } from "convex-helpers/react/cache/hooks";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useUserContext = (userId: Id<"users"> | undefined) => {
  const customizations = useQuery(
    api.function.customizations.getCustomization,
    userId ? { userId } : "skip",
  );

  const memory = useQuery(
    api.function.memory.getMemory,
    userId ? { userId } : "skip",
  );

  const systemPromptData = useMemo(() => {
    if (!userId) return null;

    return {
      userId,
      whattocalluser: customizations?.whattocalluser || "",
      whatuserdoes: customizations?.whatuserdoes || "Not specified",
      traitsforllm: customizations?.traitsforllm || [],
      preferencesofuser: customizations?.preferencesofuser || [],
      anythingelse: customizations?.anythingelse || "Not specified",
      memory: memory || "No existing memories found.",
    };
  }, [userId, customizations, memory]);

  return {
    customizations,
    memory,
    systemPromptData,
    isLoading: customizations === undefined || memory === undefined,
  };
};
