"use client";

import { ErrorPageContainer } from "@bhaisaab/shared/components/app/error-page-container";
import { useSearchParams } from "next/navigation";

/** Explains the Auth.js error named by the `error` query param. */
export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage: string;
  let errorDescription: string;

  switch (error) {
    case "AccessDenied": {
      errorMessage = "Access Denied";
      errorDescription =
        "Your email is not authorized to access this application. Please contact the administrator for access.";

      break;
    }
    default: {
      errorMessage = "An unknown error occurred.";
      errorDescription = "Please try again.";
    }
  }

  return (
    <ErrorPageContainer
      errorMessage={errorMessage}
      errorDescription={errorDescription}
    />
  );
}
