import { matchesExactRoute, matchesRouteGroup } from "./route-match";

const UNPROTECTED_ROUTES = {
  exact: {
    "/": true,
  },
  groups: {
    "/auth": true,
  },
};

export const isUnprotectedRoute = (pathname: string) => {
  return (
    matchesExactRoute(pathname, UNPROTECTED_ROUTES.exact) ||
    matchesRouteGroup(pathname, UNPROTECTED_ROUTES.groups)
  );
};
