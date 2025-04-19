"use client";
import { SidebarProvider } from "@bhaisaab/shared/components/core/sidebar";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { SessionProvider, signOut } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "../utils/error";

interface PublicClientProvidersProps {
  nonce: string | null;
}

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        getErrorMessage(error) === "Session expired - please sign in again"
      ) {
        void signOut({
          redirectTo: "/auth/login",
        });
      }

      if (query?.meta?.toast) {
        toast.error(getErrorMessage(error));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation?.meta?.toast) {
        toast.error(getErrorMessage(error));
      }
    },
  }),
});

export function PublicClientProviders({
  children,
  nonce,
}: PropsWithChildren<PublicClientProvidersProps>) {
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
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
