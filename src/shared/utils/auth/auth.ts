// In your auth.ts file
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { getCurrentScope } from "@sentry/nextjs";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

import { serverEnv } from "../env-vars/server.env";

const googleProviderConfig = {
  authorization: { ...googleServiceConfig.authorization },
};

const refreshToken = async (token: JWT): Promise<JWT> => {
  try {
    const url = `https://oauth2.googleapis.com/token?${new URLSearchParams({
      client_id: serverEnv.AUTH_GOOGLE_ID,
      client_secret: serverEnv.AUTH_GOOGLE_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token!,
    })}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token: string;
    };

    // Info log the refreshed tokens
    console.info("🚀 ~ refreshedTokens ~", refreshedTokens);

    if (!response.ok) {
      throw new Error(JSON.stringify(refreshedTokens));
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
    // If refresh fails, mark token for re-authentication
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google(googleProviderConfig)],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = serverEnv.ALLOWED_EMAILS;
      return allowedEmails.includes(user.email ?? "");
    },
    authorized({ auth }) {
      return !!auth;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        };
      }

      // log the date and time when the token was expires
      console.info(
        "🚀 ~ Token expires at ~",
        new Date((token.expires_at ?? 0) * 1000),
      );

      // Return the previous token if it hasn't expired yet
      // Add a 10-second buffer to prevent edge cases
      if (token.expires_at && token.expires_at * 1000 > Date.now() + 10_000) {
        return token;
      }

      return refreshToken(token);
    },
    session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      const scope = getCurrentScope();
      scope.setUser({
        id: session.user.id,
        email: session.user.email,
      });

      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.expires_at = token.expires_at;

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

export async function getUserSession() {
  const session = await auth();
  return session;
}
