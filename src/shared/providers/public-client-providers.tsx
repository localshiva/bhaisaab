"use client";
import { SidebarProvider } from "@bhaisaab/shared/components/core/sidebar";
import { SESSION_EXPIRED_MESSAGE } from "@bhaisaab/shared/constants/app";
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

/**
 * Sends the user to the login page when an API call reports an expired session.
 *
 * Returns true when it did, so the caller can skip its own error toast.
 */
function handleSessionExpired(error: unknown): boolean {
  const isSessionExpired =
    isAxiosError(error) &&
    error.response?.status === 401 &&
    getErrorMessage(error) === SESSION_EXPIRED_MESSAGE;

  if (isSessionExpired) {
    void signOut({
      redirectTo: "/auth/login?error=SessionExpired",
    });
  }

  return isSessionExpired;
}

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (handleSessionExpired(error)) {
        return;
      }

      if (query?.meta?.toast) {
        toast.error(getErrorMessage(error));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (handleSessionExpired(error)) {
        return;
      }

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
