import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { DemoComponent } from "@refugies-info/ui";
import { normalizeString } from "@refugies-info/shared";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/explorer",
  component: ExplorerScreen,
});

function ExplorerScreen() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Explorer</h1>
      <p>Map view will go here.</p>

      <div className="mt-8 p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">Verification</h2>
        <DemoComponent onClick={() => alert("Clicked!")}>
          Click me (UI Lib)
        </DemoComponent>
        <p className="mt-2">
          Normalized "Héllo World": <strong>{normalizeString("Héllo World")}</strong>
        </p>
      </div>
    </div>
  );
}
