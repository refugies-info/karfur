import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Theme } from "types/interface";

interface Props {
  theme: Theme | undefined | null;
  size?: number;
  color?: string;
}

const ThemeIcon = (props: Props) => {
  const size = props.size || 22;
  const [imgXml, setImgXml] = useState(`<svg width="${size}" height="${size}"></svg>`);

  useEffect(() => {
    const getImgXml = async () => {
      if (!props.theme) return;
      const xml = await (await fetch(props.theme.icon.secure_url)).text();
      setImgXml(xml);
    };
    getImgXml();
  }, [props.theme]);


  if (!props.theme) return null;

  if (props.color) {
    /* to color icon, fetch svg text, and replace stroke color in code */
    return (
      <span
        dangerouslySetInnerHTML={{
          __html:
            imgXml
              .replace(/stroke="((#[0-9a-f]{6})|(#[0-9a-f]{3})|([a-z]+))"/g, `stroke="${props.color || "white"}"`)
              .replace(/height="([0-9]+)"/g, `height="${size}"`)
              .replace(/width="([0-9]+)"/g, `width="${size}"`)
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
