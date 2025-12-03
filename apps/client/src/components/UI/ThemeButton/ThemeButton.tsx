import type { GetThemeResponse } from "@refugies-info/api-types";
import styled from "styled-components";
import { useLocale } from "~/hooks";
import { getThemeName } from "~/lib/getThemeName";
import ThemeIcon from "../ThemeIcon";

const ThemeButtonContainer = styled.div<{ color: string }>`
  background-color: ${(props: { color: string }) => props.color};
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: fit-content;
`;

const ThemeText = styled.p<{ mr?: number }>`
  color: white;
  font-size: 12px;
  margin-left: 8px;
  margin-right: ${(props: { mr?: number }) => (props.mr ? `${props.mr}px` : "0px")};
  align-self: center;
  margin-bottom: 0px;
`;

interface Props {
  theme: GetThemeResponse;
  isRTL?: boolean;
}

export const ThemeButton = (props: Props) => {
  const locale = useLocale();

  return (
    <ThemeButtonContainer color={props.theme ? props.theme.colors.color100 : ""}>
      <ThemeIcon theme={props.theme} size={14} />
      <ThemeText mr={props.isRTL ? 8 : 0}>{getThemeName(props.theme, locale, "short")}</ThemeText>
    </ThemeButtonContainer>
  );
};
