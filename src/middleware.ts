// middleware.ts
import { NextResponse } from "next/server";

import { auth } from "./shared/utils/auth/auth";
import { setSecurityHeaders } from "./shared/utils/auth/content-security-policy";

export default auth(req => {
  // First apply security headers
  const response = setSecurityHeaders(req);

  const { pathname } = req.nextUrl;

  // Fully public routes that anyone can access regardless of auth status
  const publicRoutes = [
    "/privacy-policy",
    "/terms-and-conditions",
    "/contact",
    // Coming from sentry to avoid ad-blockers
    "/monitoring",
  ];

  // Auth routes that should only be accessible when NOT logged in
  const authRoutes = ["/auth/login", "/api/auth/signin", "/auth/error"];

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (req.auth && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not authenticated
  if (!req.auth) {
    // If it's a auth route, allow it
    if (authRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    // If it's a public route, allow it
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return response;
});

// Keep your existing config for path matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
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
