import React, { ReactNode } from "react";
import styled, { useTheme } from "styled-components/native";
import { firstLetterUpperCase } from "../../../libs";
import { Picture } from "../../../types/interface";
import { ReadableText } from "../../ReadableText";
import { StreamlineIcon } from "../../StreamlineIcon";
import Columns from "../Columns";
import { HeaderContentProps } from "./HeaderContentProps";
import HeaderTitle from "./HeaderTitle";

const TitleContainer = styled.View`
  justify-content: center;
  min-height: 48px;
  padding-bottom: 8px;
`;

export interface HeaderContentTitleProps extends HeaderContentProps {
  headerBackgroundImage?: Picture;
  headerTooltip?: ReactNode;
  titleIcon?: Picture;
  title: string;
}

const HeaderContentTitle = ({
  headerBackgroundImage,
  headerTooltip,
  title,
  titleIcon,
}: HeaderContentTitleProps) => {
  const theme = useTheme();
  return (
    <TitleContainer>
      <Columns
        RTLBehaviour
        layout="1 auto"
        verticalAlign="center"
        horizontalAlign="center"
      >
        <Columns RTLBehaviour layout="auto" verticalAlign="center">
          <HeaderTitle hasBackgroundImage={headerBackgroundImage !== undefined}>
            <ReadableText overridePosY={5}>
              {firstLetterUpperCase(title)}
            </ReadableText>
          </HeaderTitle>

          {titleIcon && (
            <StreamlineIcon
              stroke={theme.colors.black}
              icon={titleIcon}
              size={24}
            />
          )}
        </Columns>
        {headerTooltip || null}
      </Columns>
    </TitleContainer>
  );
};

export default HeaderContentTitle;
