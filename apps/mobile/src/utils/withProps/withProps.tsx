import React, { ComponentClass, FunctionComponent } from "react";

const getExecuteResult = (execute: any, props: any) => {
  if (typeof execute === "function") {
    return execute(props);
  }
  return execute;
};

const withProps =
  (execute: any) =>
  // (Component: ComponentClass<any, any> | FunctionComponent<any>) => {
  (Component: any) => {
    const HOC = (props: any, ref: any) => (
      <Component ref={ref} {...props} {...getExecuteResult(execute, props)} />
    );
    HOC.displayName = `withProps(${Component.displayName || Component.name})`;
    return React.forwardRef(HOC);
  };

export default withProps;
