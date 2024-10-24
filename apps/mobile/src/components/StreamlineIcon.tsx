import { Picture } from "@refugies-info/api-types";
import { SvgXml } from "react-native-svg";
import useAsync from "react-use/lib/useAsync";
import { getImageUri } from "~/libs/getImageUri";
import { apiCaller } from "~/utils/ConfigAPI";

interface StreamlineIconProps {
  icon: Picture;
  size: number;
  stroke?: string;
}

export const StreamlineIcon = ({ icon, size = 22, stroke = "white" }: StreamlineIconProps) => {
  if (!icon.secure_url?.endsWith(".svg")) return null;
  const { value: imgXml = "<svg></svg>" } = useAsync(
    () => apiCaller.get(getImageUri(icon.secure_url)).then((result: any) => result.data as string),
    [icon],
  );
  return (
    <SvgXml
      width={size}
      height={size}
      xml={(imgXml as string).replace(/stroke="((#[0-9a-f]{6})|(#[0-9a-f]{3})|([a-z]+))"/g, `stroke="${stroke}"`)}
    />
  );
};
