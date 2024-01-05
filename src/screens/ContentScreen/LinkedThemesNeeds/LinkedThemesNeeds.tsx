import React, { memo } from "react";
import { View } from "react-native";
import isEmpty from "lodash/isEmpty";
import { Id } from "@refugies-info/api-types";
import { ReadableText, Spacer, StyledTextSmallBold } from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import { styles } from "../../../theme";
import { LinkedNeed, LinkedTheme } from "../Sections";

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
            <LinkedNeed key={need.toString()} needId={need} />
          ))}
        {theme && !isEmpty(theme) && (
          <LinkedTheme key={theme.toString()} themeId={theme} />
        )}
        {secondaryThemes &&
          !isEmpty(secondaryThemes) &&
          secondaryThemes.map((secondaryTheme) => (
            <LinkedTheme
              key={secondaryTheme.toString()}
              themeId={secondaryTheme}
            />
          ))}
      </View>
    </>
  );
};

export const LinkedThemesNeeds = memo(LinkedThemesNeedsComponent);
