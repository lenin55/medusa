import { AdminRoutesWrapper } from "./routes/admin-routes-wrapper"

/**
 * This extension ensures that all admin routes, including plugin-provided routes like
 * notification-template, are wrapped with the React Query provider.
 * 
 * It also handles authentication tokens by preserving the auth context across route changes.
 */
export default {
  name: "medusa-admin-query-client-provider",
  resolve: () => {
    return {
      RouteComponent: AdminRoutesWrapper,
      config: {
        sensitive: true,
        // This ensures that auth tokens are preserved and passed to the wrapped components
        passRouteData: true,
      },
    }
  },
}