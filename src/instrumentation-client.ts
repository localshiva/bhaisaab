import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // eslint-disable-next-line no-secrets/no-secrets
  dsn: "https://42222800f48301707d0e6ec1a4d9cf03@o4509055583846400.ingest.de.sentry.io/4509055594659920",

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 1,

  replaysSessionSampleRate: 0.1,

  replaysOnErrorSampleRate: 1,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
