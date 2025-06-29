import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ToastProvider } from "@heroui/toast";
import { Inter } from "next/font/google";

import { Providers } from "../components/providers";

import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html suppressHydrationWarning lang="en" className={inter.className}>
        <head />
        <body>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <main>{children}</main>
            <ToastProvider />
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
