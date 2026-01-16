import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/favoris",
  component: FavorisScreen,
});

function FavorisScreen() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Favoris</h1>
      <p>Saved content will appear here.</p>
    </div>
  );
}
