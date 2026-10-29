# Google sign-in

## Purpose

Lets a family member sign in with their Google account. Only emails on the allowed list can sign in.

Sign-in uses OAuth. OAuth is the standard way for an app to ask Google for permission to act for a user. The user approves on Google's own page, and Google hands the app a token. Auth.js (the `next-auth` library) runs this flow.

## Requirements

1. The `/auth/login` page shows a theme switcher above a sign-in card. The card holds these parts, top to bottom.
   - A four-colour bar.
   - The logo `/logo/wallet.svg` and the app name "Bhaisaab".
   - The line "Sign in to manage your finances".
   - A "Sign in with Google" button with the Google logo.
   - The notice "Only authorized emails can access this application".
2. The login page has no support or contact link.
3. The whole card is a form. The button submits it to a server action, which is a function that runs on the server when the form is sent. The action calls Auth.js `signIn("google")` with `redirectTo: "/"`.
4. Google asks the user to approve these scopes, which are the permissions the app requests. The app requests no other scope.
   - `userinfo.email`
   - `userinfo.profile`
   - `spreadsheets`
5. The Google request sets `access_type: "offline"`, `prompt: "consent"` and `response_type: "code"`.
6. When Google returns the user, the Auth.js `signIn` callback allows the sign-in only when the user's email is in `ALLOWED_EMAILS`.
7. The match trims spaces and ignores letter case. It does so on each entry of `ALLOWED_EMAILS` and on the signing-in email.
8. The allowed list is checked again on every session check, not only at sign-in. See [session-and-token-refresh.md](session-and-token-refresh.md).
9. An allowed user gets a session and lands on `/`, which redirects to `/monthly-expenses`.
10. A rejected user is sent to `/auth/error?error=AccessDenied`. See [auth-error-page.md](auth-error-page.md).
11. When the server action throws an Auth.js error, the user is sent to `/auth/login?error={type}`, where `{type}` is the error's type. Auth.js also sends sign-in errors from the Google callback, such as `OAuthCallbackError`, to `/auth/login?error={type}`.
12. When the server action throws any other error, the login route's error boundary shows "Uh, Oh!" with the error's message.
13. The login page reads the `error` query value and shows a toast, which is a short message that pops up at the edge of the screen.
    - `SessionExpired` shows the info toast "Your session expired. Please sign in again." with the id `session-expired`.
    - Any other value shows the error toast "An error occurred during sign in. Please try again." with the id `login-error`.
14. While the login route loads, it shows a card with a spinner and "Loading...".

## Data

No sheet. The allowed list comes from the `ALLOWED_EMAILS` environment variable.

| Variable         | Format                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `ALLOWED_EMAILS` | comma-separated emails, required, at least one entry. Spaces around an entry and letter case do not matter. |

The server's environment check fails when `ALLOWED_EMAILS` is missing. What the session stores after sign-in is in [session-and-token-refresh.md](session-and-token-refresh.md).

## Decisions

- **No support link on the login page.** Only allowed emails can sign in, and those users know who runs the app.
- **Only the scopes the app uses are requested.** The app should ask only for the access it uses. It reads the user's identity and reads and writes the sheet. So, it needs the two `userinfo` scopes and `spreadsheets`.
- **The email match trims spaces and ignores case.** An `ALLOWED_EMAILS` value of `a@x.com, b@x.com` must match `b@x.com`, and email addresses are case-insensitive in practice.
- **Google is asked for offline access with a consent prompt.** This makes Google return a refresh token on every sign-in. The token refresh in [session-and-token-refresh.md](session-and-token-refresh.md) needs it.
- **Toasts use fixed ids.** React runs the effect twice in development. A fixed id stops the same toast from showing twice.

## Edge cases

- **Email not on the list.** The user reaches `/auth/error` with "Access Denied" and gets no session.
- **User cancels on Google's page.** Auth.js treats it as a sign-in error and the login page shows the generic error toast.
- **No `error` value.** The login page shows no toast.
- **Users with a current session.** `prompt: "consent"` makes Google show its consent screen on every sign-in. So, their next sign-in shows the consent screen as usual, listing only the scopes above. Until then, their current token keeps the scopes it was granted.
