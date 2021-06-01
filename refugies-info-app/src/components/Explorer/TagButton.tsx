import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { theme } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import i18n, { t } from "../../services/i18n";
import { StreamlineIcon } from "../StreamlineIcon";

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
  justify-content: space-between;
  align-items: center;
`;
const StyledText = styled(StyledTextNormalBold)`
  color: ${theme.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  flex-wrap: wrap;
`;
export const TagButton = (props: Props) => (
  <StyledContainer backgroundColor={props.backgroundColor}>
    <StyledText isRTL={i18n.isRTL()}>
      {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName))}
    </StyledText>
    <StreamlineIcon name={props.iconName} width={20} height={20} />
  </StyledContainer>
);
