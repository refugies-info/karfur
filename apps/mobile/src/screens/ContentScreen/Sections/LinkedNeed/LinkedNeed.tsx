import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Id } from "@refugies-info/api-types";
import {
  currentI18nCodeSelector,
  needSelector,
  themeSelector,
} from "../../../../services";
import { styles } from "../../../../theme";
import { NeedsSummary } from "../../../../components/Needs/NeedsSummary";

interface LinkedNeedProps {
  needId: Id;
  beforeNavigate?: () => boolean;
}

const LinkedNeed = ({ needId, beforeNavigate }: LinkedNeedProps) => {
  const need = useSelector(needSelector(needId));
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const theme = useSelector(themeSelector(need?.theme._id.toString()));

  if (!need || !need.image) return null;
  if (!theme) return null;

  const needText = useMemo(() => {
    return currentLanguageI18nCode && need[currentLanguageI18nCode]?.text
      ? need[currentLanguageI18nCode].text
      : need.fr.text;
  }, [currentLanguageI18nCode, need]);

  return (
    <NeedsSummary
      id={need._id.toString()}
      image={need.image || theme.appImage}
      key={need._id.toString()}
      needSubtitle=""
      needText={needText}
      needTextFr={need.fr.text}
      style={{ marginBottom: styles.margin * 2 }}
      theme={theme}
      beforeNavigate={beforeNavigate}
    />
  );
};

export default LinkedNeed;
