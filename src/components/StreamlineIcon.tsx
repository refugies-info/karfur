import React, { useEffect, useState } from "react";
import { Picture } from "../types/interface";
import { SvgXml } from "react-native-svg";
import { getImageUri } from "../libs/getImageUri";

interface Props {
  icon: Picture;
  size: number;
  stroke?: string;
}
export const StreamlineIcon = (props: Props) => {
  const [imgXml, setImgXml] = useState("<svg></svg>");

  const getImgXml = async () => {
    const url = getImageUri(props.icon.secure_url);
    const xml = await (await fetch(url)).text();
    setImgXml(xml);
  };

  useEffect(() => {
    getImgXml();
  }, []);

  return (
    <SvgXml
      width={props.size || 22}
      height={props.size || 22}
      xml={imgXml
        .replace(/stroke="((#[0-9a-f]{6})|([a-z]+))"/g, `stroke="${props.stroke || "white"}"`)
      }
    />
  )
};
