import { type Account } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /**
   * Google tokens kept in the encrypted session cookie.
   *
   * They are not copied to the session, which is also sent to the browser.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface JWT extends DefaultJWT {
    access_token: Account["access_token"];
    refresh_token: Account["refresh_token"];
    expires_at: Account["expires_at"];
  }
}
