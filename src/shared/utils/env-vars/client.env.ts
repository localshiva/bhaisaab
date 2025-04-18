// env.server.ts
import { z } from "zod";

const clientSchema = z.object({
  isProduction: z.boolean(),
  isDev: z.boolean(),
});

// Client-side env
export const clientEnv = clientSchema.parse({
  isProduction: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
});

export type ClientEnv = z.infer<typeof clientSchema>;
