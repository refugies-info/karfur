import type React from "react";

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
