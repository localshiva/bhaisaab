import { NextResponse } from "next/server";

export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function generateCSP(nonce: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;

  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isProduction ? "" : "'unsafe-eval'"};
    script-src-elem 'self' 'nonce-${nonce}' https: ${isProduction ? "" : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://i.ytimg.com;
    font-src 'self';
    connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://i.ytimg.com ${
      isProduction
        ? ""
        : "http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*"
    };
    worker-src 'self';
    manifest-src 'self';
    object-src 'none';
    frame-src 'self' https://www.youtube-nocookie.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isProduction ? "upgrade-insecure-requests;" : ""}
  `
    .replaceAll(/\s+/g, " ")
    .trim();
}

export function setSecurityHeaders(response: NextResponse) {
  const nonce = generateNonce();
  const csp = generateCSP(nonce);

  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),payment=(),usb=()",
  );

  return response;
}
