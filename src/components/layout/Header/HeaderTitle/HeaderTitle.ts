import styled from "styled-components/native";

export interface HeaderTitleProps {
  hasBackgroundImage?: boolean;
  invertedColor?: boolean;
}

const HeaderTitle = styled.Text<HeaderTitleProps>`
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  text-align: ${({ theme }) => (theme.i18n.isRTL ? "right" : "left")};
  color: ${({ invertedColor, theme }) =>
    invertedColor ? theme.colors.white : theme.colors.black};
  font-size: 25px;
  line-height: 40px;

  ${({ hasBackgroundImage, theme }) =>
    hasBackgroundImage &&
    `opacity: 0.9;
    background-color: ${theme.colors.white};
    padding: ${theme.margin}px;`}
`;

export default HeaderTitle;
