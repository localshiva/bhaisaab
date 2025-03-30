// env.server.ts
import { z } from "zod";

const serverSchema = z.object({
  // Next Auth
  AUTH_SECRET: z.string().min(1),

  // Google OAuth
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  GOOGLE_SPREADSHEET_ID: z.string().min(1),

  // Env
  isProduction: z.boolean(),
  isDev: z.boolean(),

  // Emails
  ALLOWED_EMAILS: z.array(z.string()).nonempty(),
});

// Server-side env
export const serverEnv = serverSchema.parse({
  // Next Auth
  AUTH_SECRET: process.env.AUTH_SECRET,

  // Google OAuth
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

  // Env
  isProduction: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",

  // Emails
  ALLOWED_EMAILS: process.env.ALLOWED_EMAILS?.split(",") ?? [],
});

export type ServerEnv = z.infer<typeof serverSchema>;
