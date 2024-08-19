import React from "react";
import styled, { useTheme } from "styled-components/native";
import { HeaderContentProps } from "./HeaderContentProps";
import { ReadableText } from "../../ReadableText";
import HeaderTitle from "./HeaderTitle";

const TitleContainer = styled.View`
  justify-content: center;
  min-height: 48px;
  padding-bottom: 8px;
`;

export interface HeaderContentContentsScreenProps extends HeaderContentProps {
  needName: string;
}

export const HeaderContentContentsScreen = ({
  needName,
}: HeaderContentContentsScreenProps) => {
  const theme = useTheme();
  return (
    <TitleContainer>
      <HeaderTitle>
        <ReadableText overridePosY={10}>{needName}</ReadableText>
      </HeaderTitle>
    </TitleContainer>
  );
};

export default HeaderContentContentsScreen;
