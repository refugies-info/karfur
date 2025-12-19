import type { Picture } from "@refugies-info/api-types";
import type { AxiosResponse } from "axios";
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
    () =>
      apiCaller
        .get<string>(getImageUri(icon.secure_url!))
        .then((response: AxiosResponse<string>) => response.data),
    [icon],
  );
  return (
    <SvgXml
      width={size}
      height={size}
      xml={(imgXml as string)
        .replace(/stroke="[^"]*"/g, `stroke="${stroke}"`)
        .replace(/fill="[^"]*"/g, `fill="${stroke}"`)}
    />
  );
};
