import React, { useEffect, useState } from "react";
import * as eva from "eva-icons";
import styles from "./EVAIcon.module.scss";
import { cls } from "lib/classname";

const SIZE = {
  small: "12px",
  medium: "20px",
  large: "24px",
  xlarge: "30px",
  hero: "60px",
  xhero: "80px"
};

interface Props {
  fill: string;
  size: "small" | "medium" | "large" | "xlarge" | "hero" | "xhero" | number;
  name: string;
  className?: string;
  id?: string;
  onClick?: any;
}

const EVAIcon = (props: Props) => {
  const { name, fill } = props;
  const size = typeof props.size === "number" ? `${props.size}px` : SIZE[props.size];
  const [svg, setSvg] = useState("");

  useEffect(() => {
    setSvg(
      eva.icons[name].toSvg({
        fill,
        width: size,
        height: size
      })
    );
  }, [name, fill, size]);

  return (
    <span id={props.id} className={cls(props.className, styles.icon)} onClick={props.onClick}>
      <i
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{
          height: size,
          lineHeight: size
        }}
      ></i>
    </span>
  );
};

EVAIcon.defaultProps = {
  fill: "#fff",
  name: "",
  size: "medium"
};

export default EVAIcon;
