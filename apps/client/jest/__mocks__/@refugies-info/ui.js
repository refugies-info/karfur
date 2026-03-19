// Mock for the UI package
const React = require("react");

// Create a component factory that returns a simple mock component
const createMockComponent = (name) => {
  const component = ({ children, className, ...props } = {}) => {
    return React.createElement(
      "div",
      {
        "data-testid": `mock-${name}`,
        className,
        ...props,
      },
      children,
    );
  };
  component.displayName = `Mock${name}`;
  return component;
};

// Create a proxy that returns a mock component for any property access
const handler = {
  get: (target, prop) => {
    // Return existing mocks if they exist
    if (prop in target) {
      return target[prop];
    }

    // Create a new mock component for this property
    const mockComponent = jest.fn(createMockComponent(prop));
    target[prop] = mockComponent;
    return mockComponent;
  },
};

// Initial mock object with specific implementations if needed
const mocks = {
  // Special case for Carrousel that renders its children
  ThumbUpAnimated: jest.fn().mockImplementation(() => null),
  // Add any other specific implementations here
};

// Export a proxied version of the mocks object
const uiModule = new Proxy(mocks, handler);

// Attach tokens as a property
uiModule.tokens = {
  colors: {
    white: "#fff",
    dark: "#212121",
    darkColor: "#212121",
    light: "#f2f2f2",
    lightColor: "#f2f2f2",
    bleuCharte: "#0421b1",
    blue: "#0a54bf",
    focus: "#2d9cdb",
    bgFocus: "#d2edfc",
    lightBlue: "#d2edfc",
    gray10: "#fbfbfb",
    gray20: "#f2f2f2",
    gray30: "#f6f6f6",
    gray40: "#e5e5e5",
    gray40b: "#edebeb",
    gray50: "#cdcdcd",
    gray60: "#c6c6c6",
    gray70: "#828282",
    gray70b: "#ababab",
    gray80: "#5e5e5e",
    gray90: "#212121",
    darkGrey: "#5e5e5e",
    lightGrey: "#edebeb",
    grey2: "#e0e0e0",
    grey50b: "#e0e0e0",
    green: "#137f3a",
    vert: "#2ca12a",
    vert2: "#008205",
    vertFonce: "#219653",
    greenValidate: "#bdf0c7",
    lightgreen: "#def6c2",
    lightGreen: "#def6c2",
    validation: "#def6c2",
    validationDefault: "#8bc34a",
    validationHover: "#4caf50",
    orange: "#ff9800",
    orangeDark: "#ea6206",
    darkOrange: "#ea6206",
    lightOrange: "#ffe2b8",
    standby: "#fdd497",
    yellow: "#ffeb3b",
    lightYellow: "#fff7ae",
    redDark: "#b50437",
    rouge: "#e55039",
    error: "#f44336",
    erreur: "#ffcecb",
    darkBackgroundActionHighBlueFrance: "#8585f6",
    darkBackgroundAltBlueFrance: "#1b1b35",
    darkBackgroundAltGrey: "#1e1e1e",
    darkBackgroundContrastGrey: "#242424",
    darkBackgroundElevationContrast: "#2f2f2f",
    darkBorderPlainError: "#ff5655",
  },
  spacing: {
    u0: 0,
    u1: 4,
    u2: 8,
    u3: 12,
    u4: 16,
    u6: 24,
    u8: 32,
  },
  typography: {
    normal: { fontSize: 16, lineHeight: 24 },
  },
  breakpoints: {
    tabletUp: 48,
  },
};

// Helper functions
uiModule.u = (value) => value * 4;
uiModule.mediaMin = (breakpoint) => `@media (min-width: ${breakpoint}em)`;
uiModule.mediaMax = (breakpoint) => `@media (max-width: ${breakpoint}em)`;

module.exports = uiModule;
