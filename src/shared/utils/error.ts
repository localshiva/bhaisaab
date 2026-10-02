import { AxiosError, isAxiosError } from "axios";
import { NextResponse } from "next/server";

import { SESSION_EXPIRED_MESSAGE } from "../constants/app";

const isLikelyHTML = (str: string) => /^<!doctype html>/i.test(str.trim());

// Get error message based on the error type which could be Error or AxiosError
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Something went wrong. Please retry.",
): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;

    const rawData = axiosError?.response?.data;

    // 🛑 Check for HTML string
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

  // If we don't know what the error is, return a generic message
  // This should never happen
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

export const getServerError = (error: unknown) => {
  console.error("API error:", getErrorMessage(error));

  // Ask the client to sign in again instead of showing Google's raw error
  if (isGoogleAuthError(error)) {
    return NextResponse.json(
      { success: false, error: SESSION_EXPIRED_MESSAGE },
      { status: 401 },
    );
  }

  // Return appropriate error response
  return NextResponse.json(
    {
      success: false,
      error: getErrorMessage(error),
    },
    { status: (error as { status?: number }).status ?? 500 },
  );
};
