import React from "react";
import { enableNotificationsListener } from "./src/libs/notifications";
import MainApp from "./src/App";

enableNotificationsListener();

export default function App() {
  return <MainApp />;
}
