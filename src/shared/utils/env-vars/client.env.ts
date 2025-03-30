// env.server.ts
import { z } from "zod";

const clientSchema = z.object({
  // Next API URL
  NEXT_PUBLIC_API_URL: z.string().min(1),

  // Env
  isProduction: z.boolean(),
  isDev: z.boolean(),
});

// Server-side env
export const clientEnv = clientSchema.parse({
  // Env
  isProduction: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
});

export type ClientEnv = z.infer<typeof clientSchema>;
