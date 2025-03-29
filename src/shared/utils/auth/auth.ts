import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { serverEnv } from "../env-vars/server.env";

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: serverEnv.isDev,
  providers: [Google],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = serverEnv.ALLOWED_EMAILS;

      if (!allowedEmails.includes(user.email ?? "")) {
        throw new Error("You are not authorized to use this application.");
      }

      return true;
    },
  },
});
