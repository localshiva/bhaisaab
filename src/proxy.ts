import { auth } from "@bhaisaab/shared/server/auth";
import { setSecurityHeaders } from "@bhaisaab/shared/server/content-security-policy";
import { NextResponse } from "next/server";

/**
 * The only public pages. A signed-in visitor is sent away from them.
 */
const authRoutes = ["/auth/login", "/auth/error"];

export const proxy = auth(req => {
  const response = setSecurityHeaders(req);

  const { pathname } = req.nextUrl;

  if (req.auth && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!req.auth) {
    if (authRoutes.some(route => pathname.startsWith(route))) {
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
        // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js parses this config statically and rejects tagged templates
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
