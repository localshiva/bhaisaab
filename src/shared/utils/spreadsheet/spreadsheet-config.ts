import { google, sheets_v4 } from "googleapis";

import { getUserSession } from "../auth/auth";
import { serverEnv } from "../env-vars/server.env";

/**
 * Configuration for Google services
 * These settings control how we interact with Google APIs
 */
export const googleServiceConfig = {
  spreadsheetId: serverEnv.GOOGLE_SPREADSHEET_ID,

  // Authorization settings for Google APIs
  authorization: {
    params: {
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
};

/**
 * Creates a Google Sheets API client using OAuth token from the user's session
 *
 * @param token OAuth token with Google Sheets scope
 * @returns Google Sheets API client
 */
export async function createSheetsClient(): Promise<sheets_v4.Sheets> {
  const session = await getUserSession();

  if (!session?.user || !session.accessToken) {
    throw new Error("User not authenticated or missing access token");
  }

  // Create OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  // Create and return Sheets client
  return google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
}
