"use client";

import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface AuthErrorContainerProps {
  errorMessage: string;
  errorDescription: string;
}

export const AuthErrorContainer: FC<AuthErrorContainerProps> = ({
  errorMessage,
  errorDescription,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-lg dark:bg-card">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-3 dark:bg-destructive/20">
            <AlertTriangle className="size-8 text-destructive" />
          </div>

          <div className="space-y-2 text-center">
            <Typography variant="h4" textColor="destructive" weight="semibold">
              {errorMessage}
            </Typography>
            <Typography variant="body" textColor="muted">
              {errorDescription}
            </Typography>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="default" size="lg" className="w-full" asChild>
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
