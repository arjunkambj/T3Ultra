"use client";

import type { ThemeProviderProps } from "next-themes";
import { Provider as JotaiProvider } from "jotai";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

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
            <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
          </ConvexClientProvider>
        </JotaiProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
