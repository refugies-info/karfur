import styled from "styled-components/native";
import i18n from "../services/i18n";
import { theme } from "../theme";

export const StyledTextNormal = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.normal.fontSize}px;
  font-family: ${theme.fonts.normal.fontFamily};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.normalBold.fontSize}px;
  font-family: ${theme.fonts.normalBold.fontFamily};
`;
