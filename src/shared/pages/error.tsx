import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { getUserSession } from "@bhaisaab/shared/utils/auth/auth";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface ErrorPageContainerProps {
  errorMessage: string;
  errorDescription: string;
  href?: string;
}

export const ErrorPageContainer: FC<ErrorPageContainerProps> = async ({
  errorMessage,
  errorDescription,
}) => {
  const session = await getUserSession();

  return (
    <div className="container items-center justify-center">
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
            <Link href={session?.user?.email ? "/dashboard" : "/auth/login"}>
              Return to {session?.user?.email ? "Dashboard" : "Login"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
