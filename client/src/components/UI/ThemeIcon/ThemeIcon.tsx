import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Theme } from "types/interface";
import styles from "./ThemeIcon.module.scss";

interface Props {
  theme: Theme | undefined | null;
  size?: number;
  color?: string;
}

const ThemeIcon = (props: Props) => {
  const size = props.size || 22;
  const [imgXml, setImgXml] = useState(`<svg width="${size}" height="${size}"></svg>`);
  const [hasBeenFetched, setHasBeenFetched] = useState(false);

  useEffect(() => {
    const getImgXml = async () => {
      if (!props.theme) return;
      const xml = await (await fetch(props.theme.icon.secure_url)).text();
      setHasBeenFetched(true);
      setImgXml(xml);
    };
    getImgXml();
  }, [props.theme]);


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
