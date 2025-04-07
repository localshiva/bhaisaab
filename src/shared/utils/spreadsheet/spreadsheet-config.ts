import { google, sheets_v4 } from "googleapis";

import { getUserSession } from "../auth/auth";

/**
 * Creates a Google Sheets API client using OAuth token from the user's session
 *
 * @param token OAuth token with Google Sheets scope
 * @returns Google Sheets API client
 */
export async function createSheetsClient(): Promise<sheets_v4.Sheets> {
  const session = await getUserSession();

  if (!session?.user || !session.access_token) {
    throw new Error("User not authenticated or missing access token");
  }

  // Create OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  });
  oauth2Client.setCredentials({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expiry_date: (session.expires_at ?? 0) * 1000,
  });

  // Create and return Sheets client
  return google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
}
