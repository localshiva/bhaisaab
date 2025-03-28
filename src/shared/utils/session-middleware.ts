import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { setSecurityHeaders } from "./content-security-policy";
import { isPublicRoute } from "./routing/public-routes";
import { getRedirectUrl } from "./routing/route-guard";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = setSecurityHeaders(
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    }),
  );

  // Allow public routes to pass through
  if (isPublicRoute(request.nextUrl.pathname)) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet)
            request.cookies.set(name, value);
          for (const { name, value, options } of cookiesToSet)
            supabaseResponse.cookies.set(name, value, options);
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if redirect is needed based on auth status and current route
  const redirectUrl = getRedirectUrl(pathname, user !== null);

  if (redirectUrl !== null) {
    const url = request.nextUrl.clone();
    url.pathname = redirectUrl;
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
