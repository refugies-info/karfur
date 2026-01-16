import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BottomTabNavigator } from "../components/BottomTabNavigator";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <div className="flex-1 overflow-auto pb-[60px]">
           <Outlet />
        </div>
        <BottomTabNavigator />
      </div>
    </>
  ),
});
