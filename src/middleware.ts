import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function applyCsp(req: NextRequest) {
  // create a randomly generated nonce value
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // format the CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'strict-dynamic' 'nonce-${nonce}' https: http: ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
    connect-src 'self' https://suitable-akita-81.clerk.accounts.dev https://clerk.com ${
      process.env.NODE_ENV === "development"
        ? "http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*"
        : ""
    };
    img-src 'self' https://img.clerk.com;
    worker-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    frame-src 'self' https://challenges.cloudflare.com;
    form-action 'self';
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replaceAll(/\s{2,}/g, " ")
    .trim();

  // set the nonce and csp values in the request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export default clerkMiddleware((_, req) => {
  return applyCsp(req);
});

export const config = {
  matcher: [
    // Always include API and TRPC routes
    "/(api|trpc)(.*)",

    // Combined matcher with missing headers condition
    {
      // eslint-disable-next-line no-secrets/no-secrets
      source: String.raw`/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$).*)`,
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
