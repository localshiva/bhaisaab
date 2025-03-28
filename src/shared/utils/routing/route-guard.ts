import { isPublicRoute } from "./public-routes";
import { isUnprotectedRoute } from "./unprotected-routes";

export function getRedirectUrl(
  pathname: string,
  isAuthenticated: boolean,
): string | null {
  // Redirect authenticated users away from unprotected routes (like login)
  if (isAuthenticated && isUnprotectedRoute(pathname)) {
    return "/dashboard";
  }

  // Redirect unauthenticated users to login for any non-public, non-unprotected route
  // like /dashboard
  if (
    !isAuthenticated &&
    !isPublicRoute(pathname) &&
    !isUnprotectedRoute(pathname)
  ) {
    return "/auth/login";
  }

  return null;
}
