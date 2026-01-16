import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/profil",
  component: ProfilScreen,
});

function ProfilScreen() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Moi</h1>
      <p>User profile settings will appear here.</p>
    </div>
  );
}
