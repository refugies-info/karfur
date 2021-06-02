import * as React from "react";
import styled from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { StyledTextSmallBold } from "../StyledText";
import i18n, { t } from "../../services/i18n";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TagImage } from "./TagImage";

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
`;
const StyledText = styled(StyledTextSmallBold)`
  color: ${theme.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  flex-wrap: wrap;
`;

const CARD_HEIGHT = 320;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: CARD_HEIGHT,
    borderRadius: theme.radius * 2,
  },
});

export const CarousselCard = (props: Props) => (
  <LinearGradient
    colors={[props.colorVeryLight, props.colorLight]}
    // @ts-ignore
    style={[
      styles.card,
      {
        alignItems: ["briefcase", "soccer"].includes(props.iconName)
          ? "center"
          : "flex-start",
      },
    ]}
  >
    <TagImage name={props.iconName} />
    <StyledContainer>
      <StyledText isRTL={i18n.isRTL()}>
        {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName))}
      </StyledText>
      <StreamlineIcon name={props.iconName} width={20} height={20} />
    </StyledContainer>
  </LinearGradient>
);
