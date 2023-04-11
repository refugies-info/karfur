import React from "react";
import { GetDispositifResponse } from "@refugies-info/api-types";
import { View } from "react-native";
import styled from "styled-components/native";

import { ReadableText } from "../../ReadableText";
import { TextBigBold, TextSmallNormal } from "../../StyledText";
import { HeaderContentProps } from "./HeaderContentProps";

const Container = styled.View`
  position: relative;
`;

const TitlesContainer = styled(View)`
  height: 170px;
`;

const TitreInfoText = styled(TextBigBold)`
  opacity: 0.9;
  background-color: ${({ theme }) => theme.colors.white};
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  line-height: 40px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  padding: ${({ theme }) => theme.margin}px;
`;

const TitreMarqueText = styled(TextSmallNormal)`
  background-color: ${({ theme }) => theme.colors.white};
  opacity: 0.9;
  line-height: 32px;
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  padding: ${({ theme }) => theme.margin}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;

export interface HeaderContentContentScreenProps extends HeaderContentProps {
  content: GetDispositifResponse;
}

const HeaderContentContentScreen = ({
  content,
}: HeaderContentContentScreenProps) => {
  return (
    <Container>
      <TitlesContainer></TitlesContainer>
    </Container>
  );
};

export default HeaderContentContentScreen;
