import React from "react";
import styled from "styled-components/native";
import { TextSmallBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import ChoiceButton from "../ChoiceButton";
import { ReadableText } from "../../ReadableText";

export interface FilterButtonProps {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const StyledText = styled(TextSmallBold)<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.dsfr_action : theme.colors.dsfr_dark};
  padding-vertical: ${({ theme }) => theme.margin / 2}px;
`;

const FilterButton = (props: FilterButtonProps) => {
  const { t } = useTranslationWithRTL();
  return (
    <ChoiceButton
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={`test-filter-${props.text}`}
    >
      <ReadableText text={t("filters." + props.text)}>
        <StyledText isSelected={props.isSelected}>
          {t("filters." + props.text, props.text)}
          {props.text !== "french_level_0" &&
            props.text !== "no_french_level_filter" &&
            props.details && (
              <StyledText isSelected={props.isSelected}>
                {" "}
                ({props.details.join("/")})
              </StyledText>
            )}
        </StyledText>
      </ReadableText>
    </ChoiceButton>
  );
};

export default FilterButton;
