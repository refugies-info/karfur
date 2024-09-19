import React from "react";

// Utility type to extract props type from a component
export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
