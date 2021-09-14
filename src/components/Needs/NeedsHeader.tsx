import React from "react";
import { StyledTextBigBold } from "../StyledText";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { RTLView } from "../BasicComponents";

interface Props {
  text: string;
  color: string;
}

const MainContainer = styled.View`
  background-color: ${(props: { color: string }) => props.color};
  position: absolute;
  top: 0;
  height: 168px;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${theme.margin * 3}px;
  justify-content: flex-end;
`;

const Text = styled(StyledTextBigBold)`
  color: ${theme.colors.white};
`;
export const NeedsHeader = (props: Props) => {
  return (
    <MainContainer color={props.color}>
      <RTLView>
        <Text>{props.text}</Text>
      </RTLView>
    </MainContainer>
  );
};
