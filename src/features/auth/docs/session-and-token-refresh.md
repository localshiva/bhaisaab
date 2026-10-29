# Session and token refresh

## Purpose

Keeps a signed-in user signed in while their Google access lasts. It renews the Google token in the background and signs the user out cleanly when the token can no longer be renewed.

A few terms used below.

- An **access token** is a short-lived key from Google that lets the app read and write the user's sheet. Google sets its lifetime, usually about an hour.
- A **refresh token** is a long-lived key that the app trades with Google for a new access token.
- A **JWT** (JSON Web Token) is a small signed bundle of data. Auth.js encrypts it and stores it in a cookie, which is a value the browser sends with every request to the app.

## Requirements

1. Auth.js uses its JWT session strategy. There is no session database.
2. The JWT lives in the cookie `authjs.session-token`, or `__Secure-authjs.session-token` on HTTPS. Auth.js may split a large JWT into numbered chunks of that cookie.
3. On sign-in, the `jwt` callback stores Google's `access_token`, `refresh_token` and `expires_at` in the JWT. `expires_at` is in seconds since 1 January 1970.
4. The session object holds only what Auth.js puts there by default.
   - `user.name`
   - `user.email`
   - `user.image`
   - `expires`
5. The Google tokens are never copied to the session object and never sent in an API response.
6. A session ends after 30 days without use. This is the Auth.js default, and each session read restarts the 30 days.
7. A Google access token counts as expired when `expires_at` is missing or is less than 10 seconds away.
8. Each time Auth.js reads the session, the `jwt` callback first checks the JWT's email against `ALLOWED_EMAILS`, with the same match as sign-in. It trims spaces and ignores letter case. When the email is not on the list, the callback returns `null` and Auth.js deletes the session cookie.
9. When the email is on the list, the `jwt` callback refreshes an expired access token and saves the new JWT in the cookie. Auth.js reads the session on page requests through the proxy, in `auth()` calls on the server, and on `/api/auth/session`.
10. API routes get the Google tokens through `getGoogleTokens()` in `src/shared/server/auth.ts`. It reads the JWT straight from the cookie and makes the same allowed-list check. It returns `null` when there is no token, when the email is not on the list, or when a needed refresh fails. Otherwise it refreshes an expired access token before returning it.
11. A refresh posts the refresh token to `https://oauth2.googleapis.com/token` with the app's Google client id and secret.
    - On success, the JWT gets the new `access_token` and an `expires_at` of now plus Google's `expires_in`.
    - When Google sends a new refresh token, it replaces the old one. Otherwise the old one stays.
12. When a refresh fails, the server logs only Google's error code, or the HTTP status when there is none.
13. When a refresh fails inside the `jwt` callback, the callback returns `null` and Auth.js deletes the session cookie.
14. When `getGoogleTokens()` returns `null`, building the Sheets client throws a 401 error with the message `Session expired - please sign in again`.
15. When Google rejects a request with a 401 status or an `invalid_grant` error, `getServerError` answers with status 401 and `{ success: false, error: "Session expired - please sign in again" }`.
16. In the browser, every React Query query and mutation error is checked. A 401 whose error message is exactly `Session expired - please sign in again` signs the user out with `redirectTo: "/auth/login?error=SessionExpired"`. No error toast shows for it.
17. The sidebar user menu has a "Sign out" item. It signs the user out with `redirectTo: "/auth/login"` and shows "Signing out..." while it runs.

## Data

No sheet. The session data is split between the encrypted cookie and the session object.

| Field           | Stored in                    | Reaches the browser |
| --------------- | ---------------------------- | ------------------- |
| `name`          | JWT and session              | yes                 |
| `email`         | JWT and session              | yes                 |
| `picture`       | JWT, `user.image` in session | yes                 |
| `access_token`  | JWT only                     | no                  |
| `refresh_token` | JWT only                     | no                  |
| `expires_at`    | JWT only                     | no                  |

The JWT is encrypted with `AUTH_SECRET`. Browser code cannot read it.

## Decisions

- **The allowed list is checked on every session check.** Removing someone from the list must take effect without waiting 30 days. So, a removed email ends that user's session on their next request, whether it is a page request or an API call.
- **Google tokens stay out of the session object.** Auth.js sends the session object to the browser. So, server code reads the tokens from the encrypted cookie instead.
- **`getGoogleTokens()` tries both cookie names.** The cookie name has the `__Secure-` prefix on HTTPS only.
- **A token counts as expired 10 seconds early.** A request then never starts with a token that is about to expire.
- **The old refresh token is kept when Google sends none.** Google often leaves out the refresh token on a refresh, and the old one stays valid.
- **A failed refresh logs only Google's error code.** The response body can hold tokens, and tokens must never reach the logs.
- **Google credential errors become one session-expired 401.** The browser then signs the user out and asks them to sign in again, instead of showing Google's raw error.
- **Session expiry is signalled by a shared message.** `SESSION_EXPIRED_MESSAGE` in `src/shared/constants/app.ts` is the one string both the server and the browser check.

## Edge cases

- **Email removed from `ALLOWED_EMAILS`.** The user's next page request goes to `/auth/login?error=SessionExpired`. Their next API call gets the session-expired 401, and the browser signs them out. Signing in again goes to `/auth/error?error=AccessDenied`.
- **No refresh token in the JWT.** The refresh fails and the user is signed out.
- **Refresh token revoked by the user in their Google account.** Google answers `invalid_grant` and the user is signed out.
- **Cookie already expired.** The browser no longer sends it. So, the proxy sends the user to `/auth/login` with no session-expired toast.
- **Several API calls at once with an expired token.** Each call refreshes the token on its own.
