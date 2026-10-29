import "server-only";

import { serverEnv } from "@bhaisaab/shared/server/server.env";

/**
 * The spreadsheet the app reads and writes,
 * and the OAuth scopes the Google sign-in asks for.
 *
 * The app only reads the user's identity and reads and writes the sheet.
 * So, it asks for the two `userinfo` scopes and `spreadsheets`, nothing more.
 *
 * `access_type: "offline"` with `prompt: "consent"` makes Google return
 * a refresh token on every sign-in. The token refresh in auth needs it.
 */
export const googleServiceConfig = {
  spreadsheetId: serverEnv.GOOGLE_SPREADSHEET_ID,

  authorization: {
    params: {
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets",
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
};
