import { Id } from "@refugies-info/api-types";
import isEmpty from "lodash/isEmpty";
import { memo } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ReadableText, Spacer, TextDSFR_MD_Bold } from "~/components";
import { useTranslationWithRTL } from "~/hooks";
import { setInitialUrlActionCreator } from "~/services/redux/User/user.actions";
import { hasUserSeenOnboardingSelector, initialUrlSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { LinkedNeed, LinkedTheme } from "../Sections";

interface Props {
  needs?: Id[];
  theme?: Id;
  secondaryThemes?: Id[];
}

const LinkedThemesNeedsComponent = ({ needs, theme, secondaryThemes }: Props) => {
  const { t } = useTranslationWithRTL();

  // before leaving, if initialUrl (deeplink), clear it to return to onboarding if needed
  const initialUrl = useSelector(initialUrlSelector);
  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);
  const dispatch = useDispatch();
  /**
   * Returns true if should navigate, false if not
   */
  const beforeNavigate = (): boolean => {
    if (!initialUrl) return true;
    dispatch(setInitialUrlActionCreator(null));
    if (!hasUserSeenOnboarding) return false;
    return true;
  };

  return (
    <>
      <TextDSFR_MD_Bold accessibilityRole="header">
        <ReadableText>{t("content_screen.related_topic", "THÉMATIQUES LIÉES")}</ReadableText>
      </TextDSFR_MD_Bold>
      <Spacer height={styles.margin * 2} />
      <View>
        {needs &&
          !isEmpty(needs) &&
          needs.map((need) => <LinkedNeed key={need.toString()} needId={need} beforeNavigate={beforeNavigate} />)}
        {theme && !isEmpty(theme) && (
          <LinkedTheme key={theme.toString()} themeId={theme} beforeNavigate={beforeNavigate} />
        )}
        {secondaryThemes &&
          !isEmpty(secondaryThemes) &&
          secondaryThemes.map((secondaryTheme) => (
            <LinkedTheme key={secondaryTheme.toString()} themeId={secondaryTheme} beforeNavigate={beforeNavigate} />
          ))}
      </View>
    </>
  );
};

export const LinkedThemesNeeds = memo(LinkedThemesNeedsComponent);
