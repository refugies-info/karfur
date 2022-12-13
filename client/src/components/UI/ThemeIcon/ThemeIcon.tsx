import React from "react";
import Image from "next/legacy/image";
import { Theme } from "types/interface";
import useThemeIcon from "hooks/useThemeIcon";
import { cls } from "lib/classname";
import styles from "./ThemeIcon.module.scss";

interface Props {
  theme: Theme | undefined | null;
  size?: number;
  color?: string;
}

const ThemeIcon = (props: Props) => {
  const size = props.size || 22;
  const { imgXml, hasBeenFetched } = useThemeIcon(props.theme, size);

  if (!props.theme) return null;

  if (props.color || hasBeenFetched) {
    /* to color icon, fetch svg text, and replace stroke color in code */
    return (
      <span
        className={cls(styles.icon, "theme-icon")}
        dangerouslySetInnerHTML={{
          __html: imgXml.replace(
            /stroke="((#[0-9a-f]{6})|(#[0-9a-f]{3})|([a-z]+))"/g,
            `stroke="${props.color || "white"}"`
          )
        }}
        style={{ width: size, height: size }}
      ></span>
    );
  }

  return <Image src={props.theme.icon.secure_url} width={size} height={size} alt="" />;
};

export default ThemeIcon;
