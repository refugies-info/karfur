import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RowContainer } from "../BasicComponents";
import { theme } from "../../theme";
import { StyledTextSmallBold, StyledTextVerySmallBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const MainContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.black : theme.colors.white};
  padding: ${theme.margin * 2}px;
  box-shadow: ${(props: { isSelected: boolean }) =>
    props.isSelected ? "none" : "0px 8px 16px rgba(33, 33, 33, 0.24)"};
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${theme.margin * 2}px;
  justify-content: space-between;
  flex-wrap: wrap;
  elevation: 1;
`;

const StyledText = styled(StyledTextSmallBold)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const DetailContainer = styled.View`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.grey60};
  margin-left: ${theme.margin}px;
  padding-vertical: 4px;
  border-radius: ${theme.margin}px;
  width: 32px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TextVerySmall = styled(StyledTextVerySmallBold)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.black : theme.colors.white};
`;

const Detail = (props: { text: string; isSelected: boolean }) => (
  <DetailContainer isSelected={props.isSelected}>
    <TextVerySmall isSelected={props.isSelected}>{props.text}</TextVerySmall>
  </DetailContainer>
);

export const FilterButton = (props: Props) => {
  const { t } = useTranslationWithRTL();
  return (
    <MainContainer
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={`test-filter-${props.text}`}
    >
      <StyledText isSelected={props.isSelected}>
        {t("Filter." + props.text, props.text)}
      </StyledText>
      <RowContainer>
        {props.details &&
          props.details.map((element) => (
            <Detail
              key={element}
              isSelected={props.isSelected}
              text={element}
            />
          ))}
      </RowContainer>
    </MainContainer>
  );
};
