import React, { ForwardedRef } from "react";

const getExecuteResult = (execute: any, props: any) => {
  if (typeof execute === "function") {
    return execute(props);
  }
  return execute;
};

const withProps =
  <P extends Object, T, C extends React.FunctionComponent>(execute: "function" | unknown) =>
  (Component: C) => {
    const Wrapper = React.forwardRef<T, P>((props, ref) => (
      <Component ref={ref} {...props} {...getExecuteResult(execute, props)} />
    ));
    Wrapper.displayName = `withProps(${Component.displayName || Component.name})`;
    return Wrapper;
  };

export default withProps;
