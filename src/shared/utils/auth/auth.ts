import { getCurrentScope } from "@sentry/nextjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { serverEnv } from "../env-vars/server.env";

export const authDetails = Google({});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = serverEnv.ALLOWED_EMAILS;

      return allowedEmails.includes(user.email ?? "");
    },
    authorized: ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    session({ session }) {
      const scope = getCurrentScope();

      scope.setUser({
        id: session.user.id,
        email: session.user.email,
      });

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});
