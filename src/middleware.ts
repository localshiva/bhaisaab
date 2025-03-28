import { type NextRequest } from "next/server";

import { updateSession } from "./shared/utils/session-middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

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
      source: String.raw`/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ico)$).*)`,
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
