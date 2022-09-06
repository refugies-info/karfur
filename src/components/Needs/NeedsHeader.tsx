import React from "react";
import { StyledTextBigBold } from "../StyledText";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { RTLView } from "../BasicComponents";
import { StreamlineIcon } from "../StreamlineIcon";
import { Picture } from "../../types/interface";

interface Props {
  text: string;
  color: string;
  icon: Picture;
  isRTL: boolean;
}

const MainContainer = styled.View`
  background-color: ${(props: { color: string }) => props.color};
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: column;
  padding-horizontal: ${styles.margin * 3}px;
  padding-bottom: ${styles.margin * 3}px;
  justify-content: flex-end;
  border-bottom-left-radius: ${styles.radius * 2}px;
  border-bottom-right-radius: ${styles.radius * 2}px;
`;

const Text = styled(StyledTextBigBold)`
  color: ${styles.colors.white};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 2 : 0}px;
  margin-bottom: ${styles.margin}px;
`;

export const NeedsHeader = (props: Props) => (
  <MainContainer color={props.color}>
    <RTLView>
      <Text isRTL={props.isRTL}>{props.text}</Text>
      <StreamlineIcon icon={props.icon} size={24} />
    </RTLView>
  </MainContainer>
);
