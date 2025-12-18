import type { Picture } from "@refugies-info/api-types";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import { getImageUri } from "~/libs/getImageUri";

interface Props {
  appImage: Picture | undefined;
}
export const TagImage = ({ appImage }: Props) => {
  if (!appImage) return null;
  return (
    <View>
      <SvgUri width={"100%"} height={"100%"} uri={getImageUri(appImage.secure_url)} />
    </View>
  );
};
