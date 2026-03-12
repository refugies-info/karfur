import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import Link from "next/link";
import type React from "react";

startReactDsfr({ defaultColorScheme: "system", Link });

// Component for DSFR styling
export const DsfrProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="fr-container">{children}</div>;
};

// Export a decorator for Storybook
export const withDsfrDecorator = (Story: React.ComponentType) => (
  <DsfrProvider>
    <Story />
  </DsfrProvider>
);
