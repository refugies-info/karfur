import React from "react";
import styled from "styled-components/native";
import { TextSmallBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import ChoiceButton from "../ChoiceButton";

export interface FilterButtonProps {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const StyledText = styled(TextSmallBold)<{ selected: boolean }>`
  color: ${({ selected, theme }) =>
    selected ? theme.colors.darkBlue : theme.colors.black};
`;

const FilterButton = (props: FilterButtonProps) => {
  const { t } = useTranslationWithRTL();
  return (
    <ChoiceButton
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={`test-filter-${props.text}`}
    >
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
    </ChoiceButton>
  );
};

export default FilterButton;
