import { GetThemeResponse } from "@refugies-info/api-types";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import { getImageUri } from "~/libs/getImageUri";

interface Props {
  theme: GetThemeResponse;
}
export const TagImage = ({ theme }: Props) => {
  if (!theme.appImage) return null;
  return (
    <View>
      <SvgUri width={"100%"} height={"100%"} uri={getImageUri(theme.appImage.secure_url)} />
    </View>
  );
};
