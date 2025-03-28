/**
 * Matches a route against a set of groups.
 *
 * @param pathname The pathname of the current route
 * @param groups The groups of routes to match against
 * @returns True if the pathname matches any of the groups, false otherwise
 *
 * @example
 * matchesRouteGroup('/auth/login', {
 *   '/auth': true,
 *   '/auth/login': true,
 *   '/auth/callback': true,
 * }); -> true
 */
export const matchesRouteGroup = (
  pathname: string,
  groups: Record<string, boolean>,
) => {
  if (!pathname.startsWith('/')) return false;

  // e.g /auth/login
  const pathnameParts = pathname.split('/');

  if (pathnameParts.length < 2) return false;

  // e.g /auth/
  const routeGroup = `/${pathnameParts[1]}`;

  return !!groups[routeGroup];
};

/**
 * Matches a route against a set of routes.
 *
 * @param pathname The pathname of the current route
 * @param routes The routes to match against
 * @returns True if the pathname matches any of the routes, false otherwise
 *
 * @example
 * matchesExactRoute('/auth/login', {
 *   '/auth': true,
 *   '/auth/login': true,
 *   '/auth/callback': true,
 * }); -> true
 */
export const matchesExactRoute = (
  pathname: string,
  routes: Record<string, boolean>,
) => {
  return !!routes[pathname];
};
