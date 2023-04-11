import React, { useCallback } from "react";
import { Id } from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { currentI18nCodeSelector, themeSelector } from "../../../../services";
import { TagButton } from "../../../../components/Explorer/TagButton";
import { ContentScreenType } from "../../ContentScreen";

export interface LinkedThemesProps {
  themeId: Id;
}

const LinkedThemes = ({ themeId }: LinkedThemesProps) => {
  const navigation = useNavigation<ContentScreenType["navigation"]>();
  const theme = useSelector(themeSelector(themeId.toString()));
  const currentLanguage = useSelector(currentI18nCodeSelector);

  if (!theme) return null;

  const onPress = useCallback(() => {
    // logEventInFirebase(FirebaseEvent.CLIC_THEME, {
    //   theme: theme.name.fr,
    //   view: "list",
    // });

    navigation.navigate("NeedsScreen", {
      theme,
    });
    return;
  }, [navigation]);

  return (
    <TagButton
      name={theme.name[currentLanguage || "fr"]}
      backgroundColor={[theme.colors.color100, theme.colors.color80]}
      icon={theme.appImage}
      iconSize={60}
      onPress={onPress}
    />
  );
};

export default LinkedThemes;
