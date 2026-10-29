import "server-only";

import { z } from "zod";

const serverSchema = z.object({
  AUTH_SECRET: z.string().min(1),

  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  GOOGLE_SPREADSHEET_ID: z.string().min(1),

  isProduction: z.boolean(),
  isDev: z.boolean(),

  ALLOWED_EMAILS: z.array(z.string()).nonempty(),
});

export const serverEnv = serverSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,

  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,

  isProduction: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",

  ALLOWED_EMAILS: process.env.ALLOWED_EMAILS?.split(",") ?? [],
});

export type ServerEnv = z.infer<typeof serverSchema>;
