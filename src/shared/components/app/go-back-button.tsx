// @bhaisaab/shared/components/app/go-back-button.tsx
"use client";

import { Button } from "@bhaisaab/shared/components/core/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className="min-w-[160px]"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  );
}
