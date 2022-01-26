import React from "react";
import styled from "styled-components";
import { Tag } from "types/interface";
import Streamline from "assets/streamline";

const ThemeButtonContainer = styled.div`
  background-color: ${(props) => props.color};
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: fit-content;
`;

const ThemeText = styled.p`
  color: white;
  font-size: 12px;
  margin-left: 8px;
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0px")};
  align-self: center;
  margin-bottom: 0px;
`;

interface Props {
  tag: Tag;
  t?: any;
  isRTL?: boolean;
}

export const ThemeButton = (props: Props) => (
  <ThemeButtonContainer ml={8} color={props.tag ? props.tag.darkColor : null}>
    <Streamline
      name={props.tag ? props.tag.icon : undefined}
      stroke={"white"}
      width={14}
      height={14}
    />
    <ThemeText mr={props.isRTL ? 8 : 0}>
      {props.tag ? props.t("Tags." + props.tag.short, props.tag.short) : null}
    </ThemeText>
  </ThemeButtonContainer>
);
