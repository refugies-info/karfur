import { Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { getImageUri } from "~/libs/getImageUri";

export interface UriImageProps {
  uri: string;
}

const UriImage = ({ uri }: UriImageProps) => {
  return uri.endsWith("svg") ? (
    <SvgUri width={"100%"} height={"100%"} uri={getImageUri(uri)} />
  ) : (
    <Image style={{ width: "100%", height: "100%" }} source={{ uri }} />
  );
};

export default UriImage;
