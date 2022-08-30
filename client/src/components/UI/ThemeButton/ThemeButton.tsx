import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Theme } from "types/interface";
import { useRouter } from "next/router";
import { getThemeName } from "lib/getThemeName";
import ThemeIcon from "../ThemeIcon";

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
  theme: Theme;
  isRTL?: boolean;
}

export const ThemeButton = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ThemeButtonContainer color={props.theme ? props.theme.colors.color100 : ""}>
      <ThemeIcon theme={props.theme} size={14} />
      <ThemeText mr={props.isRTL ? 8 : 0}>
        {getThemeName(props.theme, router.locale, "short")}
      </ThemeText>
    </ThemeButtonContainer>
  );
};
