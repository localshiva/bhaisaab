"use client";

import { ErrorPageContainer } from "@bhaisaab/shared/components/app/error-page-container";
import { useSearchParams } from "next/navigation";

/** Explains the Auth.js error named by the `error` query param. */
export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during authentication.";
  let errorDescription = "Please try again or contact support.";

  switch (error) {
    case "AccessDenied": {
      errorMessage = "Access Denied";
      errorDescription =
        "Your email is not authorized to access this application. Please contact the administrator for access.";

      break;
    }
    case "OAuthSignin": {
      errorMessage = "Sign-in Error";
      errorDescription =
        "There was an issue starting the sign-in process. Please try again.";

      break;
    }
    case "OAuthCallback": {
      errorMessage = "Authentication Failed";
      errorDescription =
        "There was an error during the authentication process.";

      break;
    }
    default: {
      errorMessage = "An unknown error occurred.";
      errorDescription = "Please try again or contact support.";
    }
  }

  return (
    <ErrorPageContainer
      errorMessage={errorMessage}
      errorDescription={errorDescription}
    />
  );
}
