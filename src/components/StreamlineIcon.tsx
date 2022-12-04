import * as React from "react";
import { Picture } from "../types/interface";
import { SvgXml } from "react-native-svg";
import { getImageUri } from "../libs/getImageUri";
import useAsync from "react-use/lib/useAsync";
import { apiCaller } from "../utils/ConfigAPI";

interface StreamlineIconProps {
  icon: Picture;
  size: number;
  stroke?: string;
}

export const StreamlineIcon = ({
  icon,
  size = 22,
  stroke = "white",
}: StreamlineIconProps) => {
  const { value: imgXml = "<svg></svg>" } = useAsync(
    () =>
      apiCaller
        .get(getImageUri(icon.secure_url))
        .then((result: any) => result.data as string),
    [icon]
  );
  return (
    <SvgXml
      width={size}
      height={size}
      xml={(imgXml as string).replace(
        /stroke="((#[0-9a-f]{6})|(#[0-9a-f]{3})|([a-z]+))"/g,
        `stroke="${stroke}"`
      )}
    />
  );
};
