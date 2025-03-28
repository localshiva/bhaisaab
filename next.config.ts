import withSerwistInit from "@serwist/next";

const isProduction = process.env.NODE_ENV === "production";

// For type checking during development
/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    // Get base URLs from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

    // For development, allow all protocols. For production, only allow secure protocols
    const connectSrc = isProduction
      ? [
          "'self'",
          // Ensure HTTPS in production regardless of env var
          `https://${new URL(supabaseUrl).host}/*`,
          `wss://${new URL(supabaseUrl).host}/*`,
        ]
      : [
          "'self'",
          // Development allows all protocols
          "http://localhost:*",
          "https://localhost:*",
          "ws://localhost:*",
          "wss://localhost:*",
        ];

    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self'; 
              script-src 'self' ${isProduction ? "" : `'unsafe-eval'`};
              connect-src ${connectSrc.join(" ")};
              worker-src 'self';
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `
              .replaceAll(/\s+/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist(nextConfig);
