import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "../env-vars/server.env";

export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function generateCSP(nonce: string) {
  const { isProduction } = serverEnv;
  const localhostUrls = isProduction
    ? ""
    : "http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*";

  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isProduction ? "" : "'unsafe-eval'"};
    script-src-elem 'self' 'nonce-${nonce}' https: ${isProduction ? "" : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    img-src 'self' data: https://i.ytimg.com https://authjs.dev;
    connect-src 'self' https://i.ytimg.com ${localhostUrls} https://authjs.dev https://accounts.google.com;
    worker-src 'self' blob:;
    manifest-src 'self';
    object-src 'none';
    frame-src 'self' https://www.youtube-nocookie.com https://accounts.google.com;
    base-uri 'self';
    form-action 'self' https://accounts.google.com ${localhostUrls};
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

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),payment=(),usb=()",
  );
  response.headers.delete("Content-Security-Policy");
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}
