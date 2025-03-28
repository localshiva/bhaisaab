import { matchesExactRoute, matchesRouteGroup } from "./route-match";

const PUBLIC_ROUTES = {
  exact: {
    "/privacy-policy": true,
    "/terms-of-service": true,
    "/app-install-guide": true,
  },
  groups: {},
};

export const isPublicRoute = (pathname: string) => {
  return (
    matchesExactRoute(pathname, PUBLIC_ROUTES.exact) ||
    matchesRouteGroup(pathname, PUBLIC_ROUTES.groups)
  );
};
