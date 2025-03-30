"use client";
import { SidebarProvider } from "@bhaisaab/shared/components/core/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../utils/shadcn";

interface PublicClientProvidersProps {
  nonce: string | null;
}

// Create a client
const queryClient = new QueryClient();

export function PublicClientProviders({
  children,
  nonce,
}: PropsWithChildren<PublicClientProvidersProps>) {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
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
      </SessionProvider>
    </QueryClientProvider>
  );
}
