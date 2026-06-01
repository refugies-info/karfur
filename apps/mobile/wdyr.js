/// <reference types="@welldone-software/why-did-you-render" />
import React from "react";

// This will be true in development mode for both React Native and web
if (__DEV__) {
  import("@welldone-software/why-did-you-render").then(({ default: whyDidYouRender }) => {
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      trackHooks: false,
      include: [/^ContentScreen/],
      exclude: [/^ExpoLinearGradient/],
    });
  });
}
