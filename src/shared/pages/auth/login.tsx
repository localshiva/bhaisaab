"use client";

import { ThemeSwitcher } from "@bhaisaab/shared/components/app/theme-switcher";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { APP_NAME } from "@bhaisaab/shared/constants/app";
import Image from "next/image";
import { FC, useEffect } from "react";
import { toast } from "sonner";

interface LoginProps {
  error?: string | null;
}

export const Login: FC<LoginProps> = ({ error }) => {
  // Show error toast if error parameter is provided
  useEffect(() => {
    if (error) {
      const errorMessage =
        error === "AccessDenied"
          ? "Your email is not authorized to access this application."
          : "An error occurred during sign in. Please try again.";

      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="container justify-center items-center p-4">
      <ThemeSwitcher className="justify-center" />
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-card shadow-lg dark:bg-card">
        {/* Colorful header band */}
        <div className="flex h-2">
          <div className="w-1/4 bg-chart-1"></div>
          <div className="w-1/4 bg-chart-2"></div>
          <div className="w-1/4 bg-chart-3"></div>
          <div className="w-1/4 bg-chart-4"></div>
        </div>

        <div className="p-8">
          <div className="mb-8 space-y-2 text-center">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/logo/wallet.svg"
                alt="Bhaisaab Logo"
                width={150}
                height={150}
              />
              <Typography
                variant="h2"
                textColor="primary"
                weight="bold"
                className="font-mulish"
              >
                {APP_NAME}
              </Typography>
            </div>
            <Typography variant="body" textColor="muted">
              Sign in to manage your finances
            </Typography>
          </div>

          <div className="space-y-6">
            <Button
              variant="default"
              size="lg"
              type="submit"
              className="w-full"
            >
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                Sign in with Google
              </>
            </Button>

            <div className="rounded-md bg-chart-4/10 p-3 dark:bg-chart-4/20">
              <Typography variant="small" textColor="warning">
                Only authorized emails can access this application
              </Typography>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6 text-center">
            <span className="flex items-center justify-center gap-1">
              <Typography variant="small" textColor="muted">
                Need help?
              </Typography>

              <Typography variant="small" textColor="link">
                <a href="mailto:admin@example.com">Contact support</a>
              </Typography>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
