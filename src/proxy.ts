import { auth } from "@bhaisaab/shared/server/auth";
import { setSecurityHeaders } from "@bhaisaab/shared/server/content-security-policy";
import { NextResponse } from "next/server";

const API_AUTH_SIGNIN_PATH = "/api/auth/signin";

// Fully public routes that anyone can access regardless of auth status
const publicRoutes = ["/privacy-policy", "/terms-and-conditions", "/contact"];

// Auth routes that should only be accessible when NOT logged in
const authRoutes = ["/auth/login", "/auth/error", API_AUTH_SIGNIN_PATH];

export const proxy = auth(req => {
  const response = setSecurityHeaders(req);

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (!req.auth && !pathname.startsWith(API_AUTH_SIGNIN_PATH)) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message:
            "You are not authorized to access this resource. Please log in.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return response;
  }

  if (req.auth && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!req.auth) {
    if (authRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    /**
     * A session cookie without a session means it expired
     * or the Google token refresh failed.
     *
     * Auth.js deletes that cookie on this same response.
     */
    const hadSession = req.cookies
      .getAll()
      .some(({ name }) => name.includes("authjs.session-token"));

    return NextResponse.redirect(
      new URL(
        hadSession ? "/auth/login?error=SessionExpired" : "/auth/login",
        req.url,
      ),
    );
  }

  return response;
});

export const config = {
  matcher: [
    /**
     * Runs on page requests only.
     *
     * Skips `/api`, Next.js assets, the service worker, the manifest,
     * image and font files, and router prefetches.
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
