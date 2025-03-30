"use client";
import { SidebarProvider } from "@bhaisaab/shared/components/core/sidebar";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../utils/shadcn";

interface PublicClientProvidersProps {
  nonce: string | null;
}

export function PublicClientProviders({
  children,
  nonce,
}: PropsWithChildren<PublicClientProvidersProps>) {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      nonce={nonce ?? ""}
    >
      <SidebarProvider
        className={cn({
          "flex-col": isMobile,
        })}
      >
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}
