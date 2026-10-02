import { SESSION_EXPIRED_MESSAGE } from "@bhaisaab/shared/constants/app";
import { google, sheets_v4 } from "googleapis";

import { getGoogleTokens } from "../auth/auth";

/**
 * Creates a Google Sheets API client using OAuth token from the user's session
 *
 * @param token OAuth token with Google Sheets scope
 * @returns Google Sheets API client
 */
export async function createSheetsClient(): Promise<sheets_v4.Sheets> {
  const tokens = await getGoogleTokens();

  // No tokens means the session expired or the Google refresh failed
  if (!tokens) {
    const error = new Error(SESSION_EXPIRED_MESSAGE);
    (error as { status?: number }).status = 401;

    throw error;
  }

  // Create OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  });

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: (tokens.expires_at ?? 0) * 1000,
  });

  // Create and return Sheets client
  return google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
}
