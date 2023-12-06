import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Id } from "@refugies-info/api-types";
import { useNavigation } from "@react-navigation/native";

import {
  currentI18nCodeSelector,
  needSelector,
  themeSelector,
} from "../../../../services";
import { logEventInFirebase } from "../../../../utils/logEvent";
import { FirebaseEvent } from "../../../../utils/eventsUsedInFirebase";
import { TagButton } from "../../../../components/Explorer/TagButton";

interface LinkedNeedProps {
  needId: Id;
}

const LinkedNeed = ({ needId }: LinkedNeedProps) => {
  const navigation = useNavigation();
  const need = useSelector(needSelector(needId));
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const theme = useSelector(themeSelector(need?.theme._id.toString()));
  const goToContent = useCallback(() => {
    if (!need) return null;

    logEventInFirebase(FirebaseEvent.CLIC_NEED, {
      need: need.fr.text,
    });

    // @ts-ignore
    navigation.navigate("ContentsScreen", {
      theme: theme,
      needId: needId,
    });
    return;
  }, [theme]);

  if (!need || !need.image) return null;
  if (!theme) return null;

  const needText = useMemo(() => {
    return currentLanguageI18nCode && need[currentLanguageI18nCode]?.text
      ? need[currentLanguageI18nCode].text
      : need.fr.text;
  }, [currentLanguageI18nCode, need]);

  return (
    <TagButton
      backgroundColor={theme.colors.color40}
      icon={need.image}
      iconSize={60}
      name={needText}
      onPress={goToContent}
      textColor={theme?.colors.color100 || "black"}
    />
  );
};

export default LinkedNeed;
