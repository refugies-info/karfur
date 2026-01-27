import type * as React from "react";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { AccordionAnimated } from "./AccordionAnimated";

interface Props {
  title: string;
  children: React.ReactNode;
  stepNumber?: number | null;
  defaultExpanded?: boolean;
}

export const RIAccordion = ({ title, children, stepNumber }: Props) => {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const currentLanguage = useSelector(currentI18nCodeSelector);

  return (
    <AccordionAnimated
      title={title}
      content=""
      childrenContent={children}
      stepNumber={stepNumber ?? null}
      width={windowWidth - theme.margin * 2 * 2}
      currentLanguage={currentLanguage}
      windowWidth={windowWidth}
      darkColor={theme.colors.black}
      lightColor={theme.colors.white}
      isContentTranslated={true}
      isAccordionEngagement={false}
      contentId=""
    />
  );
};
