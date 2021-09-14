import React from "react";
import { StyledTextBigBold } from "../StyledText";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { RTLView } from "../BasicComponents";
import { StreamlineIcon } from "../StreamlineIcon";

interface Props {
  text: string;
  color: string;
  iconName: string;
  isRTL: boolean;
}

const MainContainer = styled.View`
  background-color: ${(props: { color: string }) => props.color};
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${theme.margin * 3}px;
  justify-content: flex-end;
  border-bottom-left-radius: ${theme.radius * 2}px;
  border-bottom-right-radius: ${theme.radius * 2}px;
`;

const Text = styled(StyledTextBigBold)`
  color: ${theme.colors.white};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
  margin-bottom: ${theme.margin}px;
`;

export const NeedsHeader = (props: Props) => (
  <MainContainer color={props.color}>
    <RTLView>
      <Text isRTL={props.isRTL}>{props.text}</Text>
      <StreamlineIcon name={props.iconName} width={24} height={24} />
    </RTLView>
  </MainContainer>
);
