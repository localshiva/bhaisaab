"use client";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

interface PublicClientProvidersProps {
  nonce: string | null;
}

export function PublicClientProviders({
  children,
  nonce,
}: PropsWithChildren<PublicClientProvidersProps>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      nonce={nonce ?? ""}
    >
      {children}
    </ThemeProvider>
  );
}
