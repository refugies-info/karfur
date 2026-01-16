import { createRouter } from "@tanstack/react-router";

// Manual route tree definition since we are not running the watcher
import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as explorerRoute } from "./routes/explorer";
import { Route as favorisRoute } from "./routes/favoris";
import { Route as rechercheRoute } from "./routes/recherche";
import { Route as profilRoute } from "./routes/profil";

const routeTree = rootRoute.addChildren([
  indexRoute,
  explorerRoute,
  favorisRoute,
  rechercheRoute,
  profilRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
