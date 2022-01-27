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
  | "xhero";
  name: string;
  className?: string;
  id?: string;
  onClick?: any;
}

const EVAIcon = (props: Props) => {
  const { name, fill, size } = props;
  useEffect(() => {
    eva.replace({ name, fill, size })
  }, [name, fill, size]);

  return (
    <span
      id={props.id || ""}
      key={props.name}
      className={props.className || ""}
      onClick={props.onClick}
    >
      <i
        data-eva={props.name}
        data-eva-fill={props.fill}
        data-eva-height={SIZE[props.size]}
        data-eva-width={SIZE[props.size]}
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
