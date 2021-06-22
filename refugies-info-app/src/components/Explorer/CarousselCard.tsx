import * as React from "react";
import styled from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { StyledTextSmallBold } from "../StyledText";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TagImage } from "./TagImage";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  tagName: string;
  colorLight: string;
  colorVeryLight: string;
  iconName: string;
}

const StyledContainer = styled(RTLView)`
  padding-bottom: ${theme.margin * 2}px;
  margin-horizontal: ${theme.margin}px;
  align-items: center;
  margin-top: ${theme.margin * 5}px;
  align-self: center;
  justify-content: center;
`;
const StyledText = styled(StyledTextSmallBold)`
  color: ${theme.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  flex-shrink: 1;
  text-align: center;
`;

const CARD_HEIGHT = 320;
const CARD_WIDTH = 234;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: theme.radius * 2,
  },
});

export const CarousselCard = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <LinearGradient
      colors={[props.colorVeryLight, props.colorLight]}
      // @ts-ignore
      style={[
        styles.card,
        {
          alignItems: ["briefcase", "soccer"].includes(props.iconName)
            ? "center"
            : props.iconName === "glasses"
            ? "flex-end"
            : "flex-start",
        },
      ]}
    >
      <TagImage name={props.iconName} />
      <StyledContainer>
        <StyledText isRTL={isRTL}>
          {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName))}
        </StyledText>
        <StreamlineIcon name={props.iconName} width={20} height={20} />
      </StyledContainer>
    </LinearGradient>
  );
};
