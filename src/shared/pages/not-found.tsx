// @bhaisaab/shared/pages/not-found.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

import { GoBackButton } from "../components/app/go-back-button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="space-y-2">
          <Typography
            variant="h1"
            weight="bold"
            className="text-8xl text-primary"
          >
            404
          </Typography>

          <Typography variant="h3" weight="semibold" className="text-3xl">
            Page not found
          </Typography>

          <Typography
            variant="body"
            textColor="muted"
            className="max-w-sm mx-auto mt-4"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another location.
          </Typography>
        </div>

        <div className="relative py-10">
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-40 h-40 rounded-full bg-primary animate-pulse"></div>
          </div>

          <div className="relative flex justify-center">
            <FileQuestion className="h-32 w-32 text-primary/80" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="min-w-[160px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>

          <GoBackButton />
        </div>
      </div>
    </div>
  );
}
