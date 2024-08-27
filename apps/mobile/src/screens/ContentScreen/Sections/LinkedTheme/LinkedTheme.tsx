import { useNavigation } from "@react-navigation/native";
import { Id } from "@refugies-info/api-types";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { TagButton } from "~/components/Explorer/TagButton";
import { currentI18nCodeSelector, themeSelector } from "~/services";
import { ContentScreenType } from "../../ContentScreen";

export interface LinkedThemesProps {
  themeId: Id;
  beforeNavigate?: () => boolean;
}

const LinkedThemes = ({ themeId, beforeNavigate }: LinkedThemesProps) => {
  const navigation = useNavigation<ContentScreenType["navigation"]>();
  const theme = useSelector(themeSelector(themeId.toString()));
  const currentLanguage = useSelector(currentI18nCodeSelector);

  if (!theme) return null;

  const onPress = useCallback(() => {
    const shouldNavigate = !beforeNavigate ? true : beforeNavigate();
    if (shouldNavigate) {
      // logEventInFirebase(FirebaseEvent.CLIC_THEME, {
      //   theme: theme.name.fr,
      //   view: "list",
      // });

      navigation.navigate("NeedsScreen", {
        theme,
      });
      return;
    }
  }, [navigation]);

  return (
    <TagButton
      name={theme.short[currentLanguage || "fr"]}
      backgroundColor={[theme.colors.color100, theme.colors.color80]}
      icon={theme.appImage}
      iconSize={60}
      onPress={onPress}
    />
  );
};

export default LinkedThemes;
