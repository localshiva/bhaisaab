import { SESSION_EXPIRED_MESSAGE } from "@bhaisaab/shared/constants/app";
import { AxiosError, isAxiosError } from "axios";
import { NextResponse } from "next/server";

const isLikelyHTML = (str: string) => /^<!doctype html>/i.test(str.trim());

/**
 * Turns any thrown value into a message the user can read.
 *
 * Handles Axios errors from the app's API, Google API errors,
 * `Error` objects and plain strings.
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Something went wrong. Please retry.",
): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;

    const rawData = axiosError?.response?.data;

    // An HTML body means the request hit a page, not an API route
    if (typeof rawData === "string" && isLikelyHTML(rawData)) {
      return "Requested API route was not found.";
    }

    if (axiosError?.response?.status === 500) {
      return "There was an error processing your request. Please try again.";
    }

    return (rawData as { error?: string })?.error ?? defaultMessage;
  }

  if ((error as { data: { error_description: string } }).data) {
    const googleError = error as {
      data?: { error_description?: string; error?: string };
    };

    return (
      googleError.data?.error_description ??
      googleError.data?.error ??
      defaultMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if ((error as Error)?.message) {
    return (error as Error).message;
  }

  return defaultMessage;
};

/**
 * Whether Google rejected the user's credentials.
 *
 * Covers a revoked or expired access token (401)
 * and a refresh token Google no longer accepts (`invalid_grant`).
 */
const isGoogleAuthError = (error: unknown): boolean => {
  const { status, response } = error as {
    status?: number;
    response?: { status?: number; data?: { error?: string } };
  };

  return (
    status === 401 ||
    response?.status === 401 ||
    response?.data?.error === "invalid_grant"
  );
};

/**
 * Logs an API error and builds the JSON error response the client expects.
 *
 * Google credential errors become a 401 with `SESSION_EXPIRED_MESSAGE`,
 * which signs the user out.
 */
export const getServerError = (error: unknown) => {
  console.error("API error:", getErrorMessage(error));

  // Ask the client to sign in again instead of showing Google's raw error
  if (isGoogleAuthError(error)) {
    return NextResponse.json(
      { success: false, error: SESSION_EXPIRED_MESSAGE },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: getErrorMessage(error),
    },
    { status: (error as { status?: number }).status ?? 500 },
  );
};
