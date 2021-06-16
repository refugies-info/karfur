import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { OnboardingParamList, GoogleAPISuggestion } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import {
  RowTouchableOpacity,
  RTLTouchableOpacity,
} from "../../components/BasicComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { theme } from "../../theme";
import {
  StyledTextNormalBold,
  TextNormal,
  StyledTextNormal,
  TextSmallNormal,
  TextSmallBold,
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
  getPlaceIdFromLocationFromGoogleAPI,
} from "../../utils/API";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";

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
  background-color: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? theme.colors.grey60 : theme.colors.darkBlue};
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
  color: ${(props: { color: string }) => props.color};
  align-items: center;
`;

const ErrorText = styled(TextSmallNormal)`
  color: red;
  margin-top: ${theme.margin}px;
`;

const GeolocContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  margin-top: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  align-items: center;
`;

const GeolocText = styled(TextSmallBold)`
  margin-left: ${theme.margin}px;
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
  const [error, setError] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [isGeolocLoading, setIsGeolocLoading] = React.useState(false);

  const { t } = useTranslationWithRTL();

  const defaultError = t(
    "Erreur",
    "Une erreur est survenue, veuillez réessayer."
  );

  const resetData = () => {
    setEnteredText("");
    setSuggestions([]), setSelectedDepartment("");
    setSelectedCity("");
  };

  const onChangeText = async (data: string) => {
    setEnteredText(data);
    try {
      const results = await getCitiesFromGoogleAPI(data);
      if (results && results.data && results.data.predictions) {
        setSuggestions(results.data.predictions);
      }
    } catch (error) {
      setError(defaultError);
      resetData();
    }
  };

  const setCityAndGetDepartment = async (city: string, place_id: string) => {
    setSelectedCity(city);
    const results = await getCityDetailsFromGoogleAPI(place_id);
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
        throw new Error("NO_CORRESPONDING_DEP");
      }
      setSelectedDepartment(department);
    }
  };

  const onSelectSuggestion = async (suggestion: GoogleAPISuggestion) => {
    try {
      setEnteredText("");
      await setCityAndGetDepartment(
        suggestion.structured_formatting.main_text,
        suggestion.place_id
      );
    } catch (error) {
      setError(defaultError);
      resetData();
    }
  };

  const useGeoloc = async () => {
    try {
      setIsGeolocLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("ERREUR");
      }

      let location = await Location.getCurrentPositionAsync({});
      if (
        location &&
        location.coords &&
        location.coords.latitude &&
        location.coords.longitude
      ) {
        const result = await getPlaceIdFromLocationFromGoogleAPI(
          location.coords.longitude,
          location.coords.latitude
        );

        if (
          result &&
          result.data &&
          result.data.results &&
          result.data.results.length > 0
        ) {
          try {
            await setCityAndGetDepartment(
              result.data.results[0].name,
              result.data.results[0].place_id
            );
            setIsGeolocLoading(false);
          } catch (error) {
            setError(
              t(
                "Onboarding.error_geoloc",
                "Une erreur est survenue lors de la géolocalisation, veuillez entrer votre ville dans le champ ci-dessus."
              )
            );
            resetData();
            setIsGeolocLoading(false);
          }
        }
      }
    } catch (error) {
      setError(
        t(
          "Onboarding.error_geoloc",
          "Une erreur est survenue lors de la géolocalisation, veuillez entrer votre ville dans le champ ci-dessus."
        )
      );
      resetData();
      setIsGeolocLoading(false);
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
          {!selectedCity && !isGeolocLoading && (
            <View>
              <SearchBarCity
                enteredText={enteredText}
                onChangeText={onChangeText}
                suggestions={suggestions}
                selectSuggestion={onSelectSuggestion}
              />
              <GeolocContainer onPress={useGeoloc}>
                <Icon
                  name="navigation-2-outline"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={theme.colors.black}
                />
                <GeolocText>
                  {t("Onboarding.position", "Utiliser ma position")}
                </GeolocText>
              </GeolocContainer>
            </View>
          )}
          {isGeolocLoading && <ActivityIndicator />}
          {!!selectedCity && !!selectedDepartment && (
            <>
              <TextNormal>
                {selectedCity + " - " + selectedDepartment}
              </TextNormal>
              <TouchableOpacity onPress={resetData}>
                <TextNormal>supprimer</TextNormal>
              </TouchableOpacity>
            </>
          )}
          {!!error && <ErrorText>{error}</ErrorText>}

          {!enteredText && !isGeolocLoading && !error && (
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
          </BottomButtonsContainer>
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
