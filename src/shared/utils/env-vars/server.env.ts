// env.server.ts
import { z } from "zod";

const serverSchema = z.object({
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  isProduction: z.boolean(),
  isDev: z.boolean(),
});

// Server-side env
export const serverEnv = serverSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  isProduction: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
});

export type ServerEnv = z.infer<typeof serverSchema>;
