import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { getCurrentScope } from "@sentry/nextjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { serverEnv } from "../env-vars/server.env";

const googleProviderConfig = {
  authorization: { ...googleServiceConfig.authorization },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google(googleProviderConfig)],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = serverEnv.ALLOWED_EMAILS;

      return allowedEmails.includes(user.email ?? "");
    },
    authorized({ auth }) {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }

      return token;
    },
    session({ session, token }) {
      const scope = getCurrentScope();

      scope.setUser({
        id: session.user.id,
        email: session.user.email,
      });

      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;

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
