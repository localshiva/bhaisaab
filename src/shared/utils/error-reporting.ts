import { captureException } from "@sentry/nextjs";

export const reportToErrorTracking = (error: Error) => {
  captureException(error);
};
