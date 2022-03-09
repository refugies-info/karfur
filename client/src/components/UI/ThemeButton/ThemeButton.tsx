import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Tag } from "types/interface";
import Streamline from "assets/streamline";

const ThemeButtonContainer = styled.div`
  background-color: ${(props: {color: string}) => props.color};
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
  margin-right: ${(props: {mr?: number}) => (props.mr ? `${props.mr}px` : "0px")};
  align-self: center;
  margin-bottom: 0px;
`;

interface Props {
  tag: Tag;
  isRTL?: boolean;
}

export const ThemeButton = (props: Props) => {
  const { t } = useTranslation();

  return (
    <ThemeButtonContainer color={props.tag ? props.tag.darkColor : ""}>
      <Streamline
        name={props.tag ? props.tag.icon : undefined}
        stroke={"white"}
        width={14}
        height={14}
      />
      <ThemeText mr={props.isRTL ? 8 : 0}>
        {props.tag ? t("Tags." + props.tag.short, props.tag.short) : null}
      </ThemeText>
    </ThemeButtonContainer>
  );
};
