import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/recherche",
  component: RechercheScreen,
});

function RechercheScreen() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Recherche</h1>
      <p>Search functionality will appear here.</p>
    </div>
  );
}
