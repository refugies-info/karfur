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
module.exports = new Proxy(mocks, handler);
