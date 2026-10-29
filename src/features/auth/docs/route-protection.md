# Route protection

## Purpose

Keeps every page and API route that shows or changes family data behind sign-in. Lets anyone reach the login and auth error pages.

The page check lives in the proxy. The proxy (`src/proxy.ts`, called middleware in older Next.js versions) is code that runs on the server before a request reaches a page. The API check lives in the Sheets client.

## Requirements

1. The proxy runs on page requests only. Its matcher skips these requests.
   - Paths that start with `api`, `_next/static` or `_next/image`.
   - `favicon.ico`, `sw.js` and `manifest.webmanifest`.
   - Paths that end in `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.woff`, `.woff2` or `.ico`.
   - Router prefetches, which carry a `next-router-prefetch` header or a `purpose: prefetch` header.
2. A signed-in visitor whose path starts with `/auth/login` or `/auth/error` is redirected to `/`.
3. A visitor without a session may open any path that starts with `/auth/login` or `/auth/error`. These are the only public pages.
4. A visitor without a session who opens any other page is redirected to the login page.
   - When the request carries a cookie whose name contains `authjs.session-token`, the target is `/auth/login?error=SessionExpired`.
   - Otherwise the target is `/auth/login`.
5. `/` redirects to `/monthly-expenses`. It is a protected page.
6. The layout of every page under `src/app/(authenticated)/` reads the session with `getUserCredentials()`. It throws "User is not authenticated" when the session has no email, and the error boundary shows "Uh, Oh!" with that message.
7. `/api/auth/*` is served by the Auth.js handlers and needs no session.
8. The proxy does not check `/api/spreadsheet/*`. Each of those handlers builds a Sheets client with `createSheetsClient()`. That call throws a 401 error with the message `Session expired - please sign in again` when `getGoogleTokens()` returns `null`, and the handler returns it as a 401 JSON response.

## Data

No sheet. The proxy decides from the Auth.js session and from the names of the request's cookies.

| Path                         | Without a session          | With a session  |
| ---------------------------- | -------------------------- | --------------- |
| `/auth/login`, `/auth/error` | allowed                    | redirect to `/` |
| any other page               | redirect to `/auth/login`  | allowed         |
| `/api/auth/*`                | allowed                    | allowed         |
| `/api/spreadsheet/*`         | 401 from the Sheets client | allowed         |

## Decisions

- **The auth pages are the only public pages.** The app has no privacy policy, terms or contact pages. So, the proxy lists no other public paths.
- **The proxy does not handle `/api` routes.** The Sheets client is the one place that rejects unauthenticated API calls with a 401. A browser API call needs a JSON 401 it can act on, and the browser signs the user out when it sees one. A redirect to the HTML login page gives it nothing to act on. Every spreadsheet route builds a Sheets client. So, one check there covers them all.
- **A new API route that does not build a Sheets client must check the session itself.** Nothing else protects it.
- **A leftover session cookie means the session expired.** When the session has expired, the Google token refresh has failed or the email is no longer allowed, Auth.js deletes the cookie on that same response. So, a cookie that is still present on a request without a session marks an expired session, and the login page can say so.

## Edge cases

- **Session expired while browsing.** The next page request goes to `/auth/login?error=SessionExpired`.
- **Session expired during an API call.** The API answers 401 and the browser signs the user out. See [session-and-token-refresh.md](session-and-token-refresh.md).
- **Prefetch without a session.** The proxy skips it. The protected layout's session check still applies.
