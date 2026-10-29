# Auth error page

## Purpose

Tells the user why sign-in failed when Auth.js cannot send them back to the login page with a toast.

## Requirements

1. Auth.js sends errors of its "error" kind to `/auth/error?error={type}`. This page is set as `pages.error` in `src/shared/server/auth.ts`.
   - `AccessDenied` arrives when the `signIn` callback rejects the email.
   - `Configuration` arrives for server errors that Auth.js does not name to the browser.
2. The page reads the `error` query value and shows a warning icon, a title and a description.
3. `AccessDenied` shows the title "Access Denied" and the description "Your email is not authorized to access this application. Please contact the administrator for access."
4. Any other value, or no value, shows the title "An unknown error occurred." and the description "Please try again."
5. Below the message is one button. A visitor with a session sees "Return to Dashboard", which links to `/monthly-expenses`. A visitor without a session sees "Return to Login", which links to `/auth/login`.

## Data

No sheet. The page reads only the `error` query value.

| Query value    | Title                      |
| -------------- | -------------------------- |
| `AccessDenied` | Access Denied              |
| anything else  | An unknown error occurred. |

## Decisions

- **No support contact in the fallback message.** The app has no support link. Only allowed emails can sign in, and those users know who runs the app.

## Edge cases

- **Signed-in visitor.** The proxy redirects a signed-in visitor from `/auth/error` to `/`. See [route-protection.md](route-protection.md).
- **No `error` value.** The page shows the unknown error message.
