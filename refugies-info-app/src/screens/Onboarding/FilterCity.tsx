import * as React from "react";
import { View } from "react-native";
import { OnboardingParamList, GoogleAPISuggestion } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { RowTouchableOpacity } from "../../components/BasicComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { theme } from "../../theme";
import {
  StyledTextNormalBold,
  TextNormal,
  StyledTextNormal,
  TextVerySmallNormal,
} from "../../components/StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { Explaination } from "../../components/Onboarding/Explaination";
import { SearchBarCity } from "../../components/Onboarding/SearchBarCity";
import {
  getCitiesFromGoogleAPI,
  getCityDetailsFromGoogleAPI,
} from "../../utils/API";

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

const ErrorText = styled(TextVerySmallNormal)`
  color: red;
  margin-top: ${theme.margin}px;
`;

const ICON_SIZE = 24;

const getDepartementFromResult = (
  data: { long_name: string; short_name: string; types: string[] }[]
) => {
  const result = data.filter((element) =>
    element.types.includes("administrative_area_level_2")
  );
  if (result.length > 0) {
    const department = result[0].long_name;
    if (department === "Département de Paris") {
      return "Paris";
    }
    return result[0].long_name;
  }
  return null;
};

export const FilterCity = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  const [enteredText, setEnteredText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<GoogleAPISuggestion[]>(
    []
  );
  const [hasError, setHasError] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");

  const { t } = useTranslationWithRTL();

  const onChangeText = async (data: string) => {
    setEnteredText(data);
    try {
      const results = await getCitiesFromGoogleAPI(data);
      if (results && results.data && results.data.predictions) {
        setSuggestions(results.data.predictions);
      }
    } catch (error) {
      setHasError(true);
      setSuggestions([]);
    }
  };

  const onSelectSuggestion = async (suggestion: GoogleAPISuggestion) => {
    try {
      setSelectedCity(suggestion.structured_formatting.main_text);
      const results = await getCityDetailsFromGoogleAPI(suggestion.place_id);
      if (
        results &&
        results.data &&
        results.data.result &&
        results.data.result.address_components
      ) {
        const department = getDepartementFromResult(
          results.data.result.address_components
        );
        if (!department) {
          setHasError(true);
          return;
        }
        setSelectedDepartment(department);
      }
    } catch (error) {
      setHasError(true);
      setSelectedDepartment("");
      setSelectedCity("");
    }
  };

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
          <Title>
            {t("Onboarding.ville", "Dans quelle ville habites-tu ?")}
          </Title>
          <SearchBarCity
            enteredText={enteredText}
            onChangeText={onChangeText}
            suggestions={suggestions}
            selectSuggestion={onSelectSuggestion}
          />
          {hasError && (
            <ErrorText>
              {t("Erreur", "Une erreur est survenue, veuillez réessayer.")}
            </ErrorText>
          )}

          {!enteredText && (
            <Explaination
              step={1}
              defaultText="C’est pour te montrer les associations et les activités dans ta ville."
            />
          )}
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
