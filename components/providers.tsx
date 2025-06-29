"use client";

import type { ThemeProviderProps } from "next-themes";

import { Provider as JotaiProvider } from "jotai";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { api } from "@/convex/_generated/api";

// User Context
interface UserContextType {
  user: any;
  isLoading: boolean;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// User Provider Component
const UserProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const user = useQuery(api.function.users.currentUser);

    const value = React.useMemo(
      () => ({
        user,
        isLoading: user === undefined,
      }),
      [user],
    );

    return (
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
  },
);

UserProvider.displayName = "UserProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <JotaiProvider>
          <ConvexClientProvider>
            <ConvexQueryCacheProvider>
              <UserProvider>{children}</UserProvider>
            </ConvexQueryCacheProvider>
          </ConvexClientProvider>
        </JotaiProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
