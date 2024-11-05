import * as eva from "eva-icons";
import { useEffect, useState } from "react";
import { cls } from "~/lib/classname";
import styles from "./EVAIcon.module.scss";

const SIZE = {
  small: "12px",
  medium: "20px",
  large: "24px",
  xlarge: "30px",
  hero: "60px",
  xhero: "80px",
};

interface Props {
  fill?: string;
  size?: "small" | "medium" | "large" | "xlarge" | "hero" | "xhero" | number;
  name?: string;
  className?: string;
  id?: string;
  onClick?: any;
}

const EVAIcon = ({ name = "", fill = "#fff", size = "medium", ...props }: Props) => {
  const sizeInPixels = typeof size === "number" ? `${size}px` : SIZE[size];
  const [svg, setSvg] = useState("");

  useEffect(() => {
    setSvg(
      eva.icons[name].toSvg({
        fill,
        width: sizeInPixels,
        height: sizeInPixels,
      }),
    );
  }, [name, fill, sizeInPixels]);

  return (
    <span id={props.id} className={cls(props.className, styles.icon)} onClick={props.onClick}>
      <i
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{
          height: sizeInPixels,
          lineHeight: sizeInPixels,
        }}
      ></i>
    </span>
  );
};

export default EVAIcon;
