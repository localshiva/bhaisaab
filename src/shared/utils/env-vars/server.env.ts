// env.server.ts
import { z } from "zod";

const serverSchema = z.object({
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Supabase Server Config
  SUPABASE_URL: z.string().url(),
  SUPABASE_GRAPHQL_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// Server-side env
export const serverEnv = serverSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_GRAPHQL_URL: process.env.SUPABASE_GRAPHQL_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

export type ServerEnv = z.infer<typeof serverSchema>;
