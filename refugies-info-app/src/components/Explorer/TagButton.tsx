import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { theme } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import { t } from "../../services/i18n";

interface Props {
  tagName: string;
  backgroundColor: string;
  iconName: string;
}

const StyledContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  flex: 1;
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  border-radius: ${theme.radius * 2}px;
`;
const StyledText = styled(StyledTextNormalBold)`
  color: ${theme.colors.white};
`;
export const TagButton = (props: Props) => (
  <StyledContainer backgroundColor={props.backgroundColor}>
    <StyledText>
      {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName))}
    </StyledText>
  </StyledContainer>
);
