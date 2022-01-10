import * as React from "react";
import styled from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { TextSmallNormal } from "../StyledText";
import { View } from "react-native";

const BulletPoint = styled(TextSmallNormal)`
  margin-right: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin / 2 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin / 2 : 0}px;
`;
const ListItem = styled(TextSmallNormal)`
  margin-right: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin : 0}px;
`;

interface Props {
  items: (string|any)[];
  isRTL: boolean;
  style?: any;
}

export const List = (props: Props) => (
  <View style={props.style || {}}>
    {props.items.map((item, index) => (
      <RTLView key={index} style={{ alignItems: "flex-start"}}>
        <BulletPoint isRTL={props.isRTL}>{"\u2022"}</BulletPoint>
        <ListItem isRTL={props.isRTL}>{item}</ListItem>
      </RTLView>
    ))}
  </View>
);
