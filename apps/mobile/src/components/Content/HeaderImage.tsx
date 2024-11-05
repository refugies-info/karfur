import { GetThemeResponse } from "@refugies-info/api-types";
import { Image, View } from "react-native";
import { getImageUri } from "~/libs/getImageUri";

interface Props {
  theme: GetThemeResponse | null;
  height: number;
}

export const HeaderImage = ({ height, theme }: Props) =>
  theme?.appBanner ? (
    <View style={{ height, display: "flex", alignItems: "center" }}>
      <Image source={{ uri: getImageUri(theme.appBanner.secure_url) }} style={{ height, width: "100%" }} />
    </View>
  ) : null;
