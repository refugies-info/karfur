import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ChoiceButton } from "../UI/ChoiceButton";

interface Props {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const StyledText = styled(TextSmallBold)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? styles.colors.darkBlue : styles.colors.black};
`;

export const FilterButton = (props: Props) => {
  const { t } = useTranslationWithRTL();
  return (
    <ChoiceButton
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={`test-filter-${props.text}`}
    >
      <StyledText isSelected={props.isSelected}>
        {t("filters." + props.text, props.text)}
        {props.details && (
          <StyledText isSelected={props.isSelected}>
            {" "}
            ({props.details.join("/")})
          </StyledText>
        )}
      </StyledText>
    </ChoiceButton>
  );
};
