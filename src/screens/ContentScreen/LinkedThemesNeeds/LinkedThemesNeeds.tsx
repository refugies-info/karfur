import React, { memo } from "react";
import { View } from "react-native";
import isEmpty from "lodash/isEmpty";
import { Id } from "@refugies-info/api-types";
import { ReadableText, Spacer, StyledTextSmallBold } from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import { styles } from "../../../theme";
import { LinkedNeed, LinkedTheme } from "../Sections";
import { useDispatch, useSelector } from "react-redux";
import {
  hasUserSeenOnboardingSelector,
  initialUrlSelector,
} from "../../../services/redux/User/user.selectors";
import { setInitialUrlActionCreator } from "../../../services/redux/User/user.actions";

interface Props {
  needs?: Id[];
  theme?: Id;
  secondaryThemes?: Id[];
}

const LinkedThemesNeedsComponent = ({
  needs,
  theme,
  secondaryThemes,
}: Props) => {
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
      <StyledTextSmallBold accessibilityRole="header">
        <ReadableText>
          {t("content_screen.related_topic", "THÉMATIQUES LIÉES")}
        </ReadableText>
      </StyledTextSmallBold>
      <Spacer height={styles.margin * 2} />
      <View>
        {needs &&
          !isEmpty(needs) &&
          needs.map((need) => (
            <LinkedNeed
              key={need.toString()}
              needId={need}
              beforeNavigate={beforeNavigate}
            />
          ))}
        {theme && !isEmpty(theme) && (
          <LinkedTheme
            key={theme.toString()}
            themeId={theme}
            beforeNavigate={beforeNavigate}
          />
        )}
        {secondaryThemes &&
          !isEmpty(secondaryThemes) &&
          secondaryThemes.map((secondaryTheme) => (
            <LinkedTheme
              key={secondaryTheme.toString()}
              themeId={secondaryTheme}
              beforeNavigate={beforeNavigate}
            />
          ))}
      </View>
    </>
  );
};

export const LinkedThemesNeeds = memo(LinkedThemesNeedsComponent);
