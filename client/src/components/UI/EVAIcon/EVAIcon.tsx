import React, { useEffect } from "react";
//@ts-ignore
import * as eva from "eva-icons";

const SIZE = {
  small: "12",
  medium: "20",
  large: "24",
  xlarge: "30",
  hero: "60",
  xhero: "80",
};

interface Props {
  fill: string
  size: "small"
  | "medium"
  | "large"
  | "xlarge"
  | "hero"
  | "xhero" | number;
  name: string;
  className?: string;
  id?: string;
  onClick?: any;
}

const EVAIcon = (props: Props) => {
  const { name, fill } = props;
  const size = typeof props.size === "number" ? props.size : SIZE[props.size];

  useEffect(() => {
    eva.replace({ name, fill, size })
  }, [name, fill, size]);

  return (
    <span
      id={props.id || ""}
      className={props.className || ""}
      onClick={props.onClick}
    >
      <i
        data-eva={name}
        data-eva-fill={fill}
        data-eva-height={size}
        data-eva-width={size}
      />
    </span>
  );
}

EVAIcon.defaultProps = {
  fill: "#fff",
  name: "",
  size: "medium",
};

export default EVAIcon;
