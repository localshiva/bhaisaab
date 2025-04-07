import { type Account, type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Session extends DefaultSession {
    access_token: Account["access_token"];
    refresh_token: Account["refresh_token"];
    expires_at: Account["expires_at"];
    error?: string;
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface JWT extends DefaultJWT {
    access_token: Account["access_token"];
    refresh_token: Account["refresh_token"];
    expires_at: Account["expires_at"];
    error?: string;
  }
}
