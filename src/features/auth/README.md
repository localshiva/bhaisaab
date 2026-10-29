# Auth

## Purpose

Lets a family member sign in with their Google account and keeps everyone else out. Only emails on an allowed list get a session. The signed-in user's Google token is what the API routes use to read and write the Google Sheet.

## Routes

- Page `/auth/login`
- Page `/auth/error`
- API `/api/auth/*`, the Auth.js handlers for sign-in, the Google callback, the session and sign-out

## Files

| Path                                                     | Holds                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `login/login-page.tsx`                                   | Login page entry and the server action that starts Google sign-in.                       |
| `login/_shared/components/`                              | The sign-in card and its error toasts.                                                   |
| `error/error-page.tsx`                                   | Auth error page entry. Maps the `error` query value to a message.                        |
| `src/app/auth/login/`                                    | Routes to the login page, with its loading card and error boundary.                      |
| `src/app/auth/error/page.tsx`                            | Routes to the auth error page.                                                           |
| `src/app/api/auth/[...nextauth]/route.ts`                | Re-exports the Auth.js handlers.                                                         |
| `src/shared/server/auth.ts`                              | Auth.js setup. Allowed-email check, Google token storage and refresh, `getGoogleTokens`. |
| `src/proxy.ts`                                           | Public and protected page rules, and the session-expired redirect.                       |
| `src/shared/server/spreadsheet/spreadsheet-config.ts`    | Builds the Sheets client. Throws a 401 when there are no Google tokens.                  |
| `src/shared/server/spreadsheet/google-service-config.ts` | The Google OAuth scopes and parameters.                                                  |
| `src/shared/server/server.env.ts`                        | Validates `ALLOWED_EMAILS`, `AUTH_SECRET` and the Google client credentials.             |
| `src/shared/utils/error.ts`                              | Turns Google credential errors into the session-expired 401.                             |
| `src/shared/providers/public-client-providers.tsx`       | Signs the user out when an API call reports an expired session.                          |
| `src/shared/constants/app.ts`                            | `SESSION_EXPIRED_MESSAGE`, the message the server and client agree on.                   |
| `src/shared/types/next-auth.d.ts`                        | The Google token fields on the JWT type.                                                 |
| `src/shared/utils/http-client.ts`                        | The Axios client that browser code uses to call the app's own `/api` routes.             |

## Docs

- [google-sign-in.md](docs/google-sign-in.md): signing in with Google on the login page. It also covers the allowed-email check.
- [auth-error-page.md](docs/auth-error-page.md): the `/auth/error` page and its messages.
- [session-and-token-refresh.md](docs/session-and-token-refresh.md): what the session holds and how long it lasts. It also covers the Google token refresh and sign-out.
- [route-protection.md](docs/route-protection.md): which pages and API routes need a session, and where each check happens.
