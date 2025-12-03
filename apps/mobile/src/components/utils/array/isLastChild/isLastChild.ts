import React from "react";

const isLastChild = (children: unknown, index: number) =>
  index === React.Children.count(children) - 1;

export default isLastChild;
