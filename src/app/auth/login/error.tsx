"use client";
import { ErrorPageContainer } from "@bhaisaab/shared/components/app/error-page-container";

interface ErrorPageProps {
  error: Error;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <ErrorPageContainer
      errorMessage="Uh, Oh!"
      errorDescription={error.message}
    />
  );
}
