import React from "react";

const isLastChild = (children: any, index: number) => index === React.Children.count(children) - 1;

export default isLastChild;
