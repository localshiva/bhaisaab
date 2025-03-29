import { withSentryConfig } from "@sentry/nextjs";
import withSerwistInit from "@serwist/next";

const isProduction = process.env.NODE_ENV === "production";

// For type checking during development
/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    // For development, allow all protocols. For production, only allow secure protocols
    const connectSrc = isProduction
      ? ["'self'"]
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

export default withSentryConfig(withSerwist(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "localshiva",
  project: "bhaisaab",

  // Only print logs for uploading source maps in CI
  silent: process.env.CI === null,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
