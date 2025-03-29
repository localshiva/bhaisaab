"use client";

import { Login } from "@bhaisaab/shared/pages/auth/login";
import { authDetails, signIn } from "@bhaisaab/shared/utils/auth/auth";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  // Show error toast if URL contains error parameter
  useEffect(() => {
    if (error) {
      const errorMessage =
        error === "AccessDenied"
          ? "Your email is not authorized to access this application."
          : "An error occurred during sign in. Please try again.";

      toast.error(errorMessage);
    }
  }, [error]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      await signIn(authDetails.id, {
        redirectTo: callbackUrl,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [callbackUrl, setIsLoading]);

  const onSignIn = useCallback(
    () => void handleGoogleSignIn(),
    [handleGoogleSignIn],
  );

  return <Login isLoading={isLoading} onSignIn={onSignIn} />;
}
