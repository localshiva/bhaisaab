import "server-only";

import { serverEnv } from "@bhaisaab/shared/server/server.env";

/**
 * The spreadsheet the app reads and writes,
 * and the OAuth scopes the Google sign-in asks for.
 *
 * `access_type: "offline"` with `prompt: "consent"` makes Google return
 * a refresh token on every sign-in. The token refresh in auth needs it.
 */
export const googleServiceConfig = {
  spreadsheetId: serverEnv.GOOGLE_SPREADSHEET_ID,

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
