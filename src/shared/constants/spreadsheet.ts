import { serverEnv } from "../utils/env-vars/server.env";

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
