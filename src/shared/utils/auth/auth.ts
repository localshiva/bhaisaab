import { getCurrentScope } from "@sentry/nextjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { serverEnv } from "../env-vars/server.env";
import { googleServiceConfig } from "../spreadsheet/spreadsheet-config";

const googleProviderConfig = {
  authorization: { ...googleServiceConfig.authorization },
};

export const authDetails = Google(googleProviderConfig);

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google(googleProviderConfig)],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = serverEnv.ALLOWED_EMAILS;

      return allowedEmails.includes(user.email ?? "");
    },
    authorized: ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt({ token, account }) {
      return {
        ...token,
        accessToken: account?.access_token,
        refreshToken: account?.refresh_token,
      };
    },
    session({ session, token }) {
      const scope = getCurrentScope();

      scope.setUser({
        id: session.user.id,
        email: session.user.email,
      });

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});

/**
 * Helper to get authenticated user's credentials
 */
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
