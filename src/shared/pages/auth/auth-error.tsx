"use client";

import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
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
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg dark:bg-charcoal-300">
        <div className="space-y-2 text-center">
          <Typography variant="h3" textColor="danger">
            {errorMessage}
          </Typography>
          <Typography variant="body">{errorDescription}</Typography>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="primary" asChild>
            <Link href="/">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
