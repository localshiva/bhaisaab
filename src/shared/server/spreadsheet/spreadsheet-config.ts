import "server-only";

import { SESSION_EXPIRED_MESSAGE } from "@bhaisaab/shared/constants/app";
import { getGoogleTokens } from "@bhaisaab/shared/server/auth";
import { serverEnv } from "@bhaisaab/shared/server/server.env";
import { google, sheets_v4 } from "googleapis";

/**
 * Builds a Sheets client that acts as the signed-in user.
 *
 * Throws a 401 error with `SESSION_EXPIRED_MESSAGE` when there are
 * no Google tokens, so that the client signs the user out.
 */
export async function createSheetsClient(): Promise<sheets_v4.Sheets> {
  const tokens = await getGoogleTokens();

  // No tokens means the session expired or the Google refresh failed
  if (!tokens) {
    const error = new Error(SESSION_EXPIRED_MESSAGE);
    (error as { status?: number }).status = 401;

    throw error;
  }

  const oauth2Client = new google.auth.OAuth2({
    clientId: serverEnv.AUTH_GOOGLE_ID,
    clientSecret: serverEnv.AUTH_GOOGLE_SECRET,
  });

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: (tokens.expires_at ?? 0) * 1000,
  });

  return google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
}
