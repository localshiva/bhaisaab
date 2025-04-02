import { AxiosError, isAxiosError } from "axios";
import { NextResponse } from "next/server";

// Get error message based on the error type which could be Error or AxiosError
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Something went wrong. Please retry.",
): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // check if the error has status 500
    if (axiosError?.response?.status === 500) {
      return "There was an error processing your request. Please try again.";
    }

    return (axiosError?.response?.data as { error: string })?.error ?? "";
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

export const getServerError = (error: unknown) => {
  console.error("API error creating fixed deposit:", error);

  // Return appropriate error response
  return NextResponse.json(
    {
      success: false,
      error: getErrorMessage(error),
    },
    { status: (error as { status?: number }).status ?? 500 },
  );
};
