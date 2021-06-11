import * as React from "react";
import { View, Text, Button } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SmallButton } from "../../components/SmallButton";
import { RowTouchableOpacity } from "../../components/BasicComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { theme } from "../../theme";
import {
  StyledTextNormalBold,
  TextNormal,
  StyledTextNormal,
} from "../../components/StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { Explaination } from "../../components/Onboarding/Explaination";
import { SearchBarCity } from "../../components/Onboarding/SearchBarCity";

const ContentContainer = styled.View`
  padding: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const Title = styled(TextNormal)`
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin * 4}px;
`;

const LeftButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${theme.margin / 2}px;
`;

const RightButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.grey60};
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 56px;
  align-items: center;
  margin-left: ${theme.margin / 2}px;
  flex: 2;
`;

const BottomButtonsContainer = styled(RowTouchableOpacity)`
  margin-top: ${theme.margin * 3}px;
`;

const TextBold = styled(StyledTextNormalBold)`
  margin-right: ${theme.margin}px;
`;

const SearchBarCityContainer = styled.View`
  background-color: red;
  height: 100%;
`;

const ICON_SIZE = 24;
export const FilterCity = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        flex: 1,
      }}
    >
      <OnboardingHeader navigation={navigation} />
      <ContentContainer>
        <View>
          <Title>
            {t("Onboarding.ville", "Dans quelle ville habites tu ?")}
          </Title>
          <SearchBarCityContainer>
            <SearchBarCity />
          </SearchBarCityContainer>
          {/* <Text>Search bar</Text>
          <Text>Position</Text>
          <Text>Aide</Text> */}
          <Explaination
            step={1}
            defaultText="C’est pour te montrer les associations et les activités dans ta ville."
          />
        </View>
        <View>
          <OnboardingProgressBar step={1} />
          <BottomButtonsContainer>
            <LeftButtonContainer
              onPress={() => navigation.navigate("FilterAge")}
            >
              <StyledTextNormal>{t("Passer", "Passer")}</StyledTextNormal>
            </LeftButtonContainer>
            <RightButtonContainer
              onPress={() => navigation.navigate("FilterAge")}
            >
              <TextBold>{t("Suivant", "Suivant")}</TextBold>
              <Icon
                name={"arrow-forward-outline"}
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={theme.colors.black}
              />
            </RightButtonContainer>
          </BottomButtonsContainer>
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
