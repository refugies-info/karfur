import * as React from "react";
import { View, SafeAreaView } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { theme } from "../../theme";
import styled from "styled-components/native";

const ContentContainer = styled.View`
  padding: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <OnboardingHeader navigation={navigation} />
      <ContentContainer>
        <View>
          <OnboardingProgressBar step={2} />
          {/* <BottomButtonsContainer>
            <LeftButtonContainer
              onPress={() => navigation.navigate("FilterAge")}
            >
              <StyledTextNormal>{t("Passer", "Passer")}</StyledTextNormal>
            </LeftButtonContainer>
            <RightButtonContainer
              isDisabled={!selectedCity}
              onPress={() => navigation.navigate("FilterAge")}
              disabled={!selectedCity}
            >
              <TextBold
                color={!selectedCity ? theme.colors.black : theme.colors.white}
              >
                {t("Suivant", "Suivant")}
              </TextBold>
              <Icon
                name={"arrow-forward-outline"}
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={!selectedCity ? theme.colors.black : theme.colors.white}
              />
            </RightButtonContainer>
          </BottomButtonsContainer> */}
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
