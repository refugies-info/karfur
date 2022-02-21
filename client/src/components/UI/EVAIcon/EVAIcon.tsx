import React, { useEffect } from "react";
import * as eva from "eva-icons";

const SIZE = {
  small: "12px",
  medium: "20px",
  large: "24px",
  xlarge: "30px",
  hero: "60px",
  xhero: "80px",
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
  const size = typeof props.size === "number" ? `${props.size}px` : SIZE[props.size];

  useEffect(() => {
    eva.replace({ name, fill, size })
  }, [name, fill, size]);

  return (
    <span
      id={props.id}
      className={props.className}
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
