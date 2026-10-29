import "server-only";

import { serverEnv } from "@bhaisaab/shared/server/server.env";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { getCurrentScope } from "@sentry/nextjs";
import { headers } from "next/headers";
import NextAuth from "next-auth";
import { getToken, JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

const googleProviderConfig = {
  authorization: { ...googleServiceConfig.authorization },
};

/**
 * Gets a new Google access token using the stored refresh token.
 *
 * Returns `null` when the refresh fails.
 * Auth.js then deletes the session cookie and the user signs in again.
 */
const refreshToken = async (token: JWT): Promise<JWT | null> => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: serverEnv.AUTH_GOOGLE_ID,
        client_secret: serverEnv.AUTH_GOOGLE_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token!,
      }),
    });

    const refreshedTokens = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
      error?: string;
    };

    if (!response.ok) {
      // Log only Google's error code, never the token payload
      throw new Error(refreshedTokens.error ?? `HTTP ${response.status}`);
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.floor(
        (Date.now() + refreshedTokens.expires_in * 1000) / 1000,
      ),
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return null;
  }
};

/**
 * Counts the token as expired 10 seconds early,
 * so that a request never starts with a token about to expire.
 *
 * A token without `expires_at` counts as expired.
 */
const isTokenExpired = (token: JWT): boolean =>
  !token.expires_at || token.expires_at * 1000 <= Date.now() + 10_000;

/**
 * Matches an email against `ALLOWED_EMAILS`, ignoring spaces and letter case.
 *
 * The env list is already normalised when it is parsed.
 */
const isAllowedEmail = (email: string | null | undefined): boolean =>
  !!email && serverEnv.ALLOWED_EMAILS.includes(email.trim().toLowerCase());

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google(googleProviderConfig)],
  callbacks: {
    signIn({ user }) {
      return isAllowedEmail(user.email);
    },
    /**
     * Runs on every session read, not only at sign-in.
     *
     * Returning `null` makes Auth.js delete the session cookie.
     * So, an email removed from `ALLOWED_EMAILS` ends that session
     * on its next request, without waiting for the session to expire.
     */
    async jwt({ token, account, user }) {
      if (!isAllowedEmail(token.email)) {
        return null;
      }

      if (account && user) {
        return {
          ...token,
          // Without an adapter, Auth.js gives `sub` a new random id per sign-in
          sub: account.providerAccountId,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        };
      }

      return isTokenExpired(token) ? refreshToken(token) : token;
    },
    /**
     * Adds the user's id, which is the JWT's `sub`, to the session
     * and tags Sentry with it.
     */
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      const scope = getCurrentScope();
      scope.setUser({
        id: session.user.id,
        email: session.user.email,
      });

      // Google tokens stay out of the session: it is also sent to the browser
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});

export async function getUserCredentials() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("User is not authenticated");
  }

  return {
    userId: session.user.id,
    email: session.user.email,
  };
}

/**
 * Reads the Google tokens from the encrypted session cookie. Server only.
 *
 * The session object is also sent to the browser.
 * So, the tokens are read here instead of being stored on it.
 *
 * Refreshes the access token when it has expired.
 * Returns `null` when there is no session, the email is no longer
 * in `ALLOWED_EMAILS`, or the refresh fails.
 */
export async function getGoogleTokens(): Promise<JWT | null> {
  const req = { headers: await headers() };
  const { AUTH_SECRET: secret } = serverEnv;

  // The cookie name has a `__Secure-` prefix on HTTPS only
  const token =
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }));

  if (!token?.access_token || !isAllowedEmail(token.email)) {
    return null;
  }

  return isTokenExpired(token) ? refreshToken(token) : token;
}
