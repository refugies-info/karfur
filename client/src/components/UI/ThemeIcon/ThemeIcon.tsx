import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Theme } from "types/interface";
import styles from "./ThemeIcon.module.scss";
import useThemeIcon from "hooks/useThemeIcon";

interface Props {
  theme: Theme | undefined | null;
  size?: number;
  color?: string;
}

const ThemeIcon = (props: Props) => {
  const size = props.size || 22;
  const {imgXml, hasBeenFetched} = useThemeIcon(props.theme, size);

  if (!props.theme) return null;

  if (props.color || hasBeenFetched) {
    /* to color icon, fetch svg text, and replace stroke color in code */
    return (
      <span
        className={styles.icon}
        dangerouslySetInnerHTML={{
          __html:
            imgXml
              .replace(/stroke="((#[0-9a-f]{6})|(#[0-9a-f]{3})|([a-z]+))"/g, `stroke="${props.color || "white"}"`)
        }}
        style={{ width: size, height: size }}
      ></span>
    )
  }

  return (
    <Image
      src={props.theme.icon.secure_url}
      width={size}
      height={size}
      alt=""
    />
  )
}

export default ThemeIcon;
