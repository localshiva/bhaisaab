import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "../env-vars/server.env";

export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function generateCSP(nonce: string) {
  const { isProduction } = serverEnv;

  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isProduction ? "" : "'unsafe-eval'"};
    script-src-elem 'self' 'nonce-${nonce}' https: ${isProduction ? "" : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://i.ytimg.com;
    font-src 'self';
    connect-src 'self' https://i.ytimg.com ${
      isProduction
        ? ""
        : "http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*"
    };
    worker-src 'self' blob:;
    manifest-src 'self';
    object-src 'none';
    frame-src 'self' https://www.youtube-nocookie.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isProduction ? "upgrade-insecure-requests;" : ""}
  `
    .replaceAll(/\s{2,}/g, " ")
    .trim();
}

export function setSecurityHeaders(request: NextRequest) {
  const nonce = generateNonce();
  const contentSecurityPolicyHeaderValue = generateCSP(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  requestHeaders.set("X-Frame-Options", "DENY");
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("X-XSS-Protection", "1; mode=block");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  requestHeaders.set(
    "Permissions-Policy",
    "accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),payment=(),usb=()",
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
