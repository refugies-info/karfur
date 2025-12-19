import type { Preview } from "@storybook/nextjs";
import { withDsfrDecorator } from "./DsfrProvider";
import "./globals.css";

// mobile: 36em; /* 576px */
// tablet : 48em; /* 768px */
// desktop-md : 62em; /* 992px */
// desktop-lg : 75em; /* 1200px */

const RIViewports = {
  "mobile": {
    name: "mobile",
    styles: {
      width: "576px",
      height: "100%",
    },
  },
  "tablet": {
    name: "tablet",
    styles: {
      width: "768px",
      height: "100%",
    },
  },
  "desktop-md": {
    name: "Desktop medium",
    styles: {
      width: "992px",
      height: "100%",
    },
  },
  "desktop-lg": {
    name: "Desktop large",
    styles: {
      width: "1200px",
      height: "100%",
    },
  },
  "desktop-xl": {
    name: "Desktop Xl",
    styles: {
      width: "1440px",
      height: "100%",
    },
  },
};

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: {
          name: "light",
          value: "#ffffff",
        },

        dark: {
          name: "dark",
          value: "#0a0a0a",
        }
      }
    },

    viewport: {
      options: {
        ...RIViewports,
      },
    },
  },

  decorators: [withDsfrDecorator],

  initialGlobals: {
    backgrounds: {
      value: "light"
    }
  }
};

export default preview;
