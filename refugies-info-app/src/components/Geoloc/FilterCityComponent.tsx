import * as Location from "expo-location";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { TextSmallBold, StyledTextSmallBold } from "../StyledText";
import React from "react";
import { GoogleAPISuggestion } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useDispatch, useSelector } from "react-redux";
import { userLocationSelector } from "../../services/redux/User/user.selectors";
import {
  getCitiesFromGoogleAPI,
  getCityDetailsFromGoogleAPI,
  getPlaceIdFromLocationFromGoogleAPI,
} from "../../utils/API";
import { getDepartementFromResult } from "../../libs/geolocalisation";
import {
  saveUserLocationActionCreator,
  removeUserLocationActionCreator,
} from "../../services/redux/User/user.actions";
import { ContentContainer, Title } from "../Onboarding/SharedStyledComponents";
import { View, ActivityIndicator } from "react-native";
import { SearchBarCity } from "../Onboarding/SearchBarCity";
import { Icon } from "react-native-eva-icons";
import { Explaination } from "../Onboarding/Explaination";
import { ErrorComponent } from "../ErrorComponent";
import { OnboardingProgressBar } from "../Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../Onboarding/BottomButtons";
import { CustomButton } from "../CustomButton";

const GeolocContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  margin-vertical: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  align-items: center;
`;

const GeolocText = styled(TextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const SelectedCityContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.black};
  padding: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${theme.margin * 4}px;
  align-items: center;
  align-self: flex-start;
`;

const SelectedCityText = styled(StyledTextSmallBold)`
  color: ${theme.colors.white};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const BottomButtonsContainer = styled.View``;

const ValidateButtonContainer = styled.View`
  margin-bottom: ${theme.margin * 2}px;
`;

const ICON_SIZE = 24;

interface Props {
  navigation: any;
  isOnboardingScreen: boolean;
}

export const FilterCityComponent = (props: Props) => {
  const [enteredText, setEnteredText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<GoogleAPISuggestion[]>(
    []
  );
  const [error, setError] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [isGeolocLoading, setIsGeolocLoading] = React.useState(false);

  const { t, isRTL } = useTranslationWithRTL();

  const defaultError = t("Erreur", "Une erreur est survenue, réessaie.");

  const dispatch = useDispatch();

  const resetData = () => {
    setEnteredText("");
    setSuggestions([]);
    setSelectedDepartment("");
    setSelectedCity("");
  };

  const userLocation = useSelector(userLocationSelector);

  React.useEffect(() => {
    if (userLocation.city && userLocation.department) {
      setSelectedCity(userLocation.city);
      setSelectedDepartment(userLocation.department);
    }
  }, [userLocation.city, userLocation.department]);

  const onChangeText = async (data: string) => {
    setError("");
    setEnteredText(data);
    try {
      const results = await getCitiesFromGoogleAPI(data);
      if (results && results.data && results.data.predictions) {
        setSuggestions(results.data.predictions);
      }
    } catch (error) {
      setError(defaultError);
      resetData();
      setIsGeolocLoading(false);
    }
  };

  const setCityAndGetDepartment = async (city: string, place_id: string) => {
    setIsGeolocLoading(true);
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
        setIsGeolocLoading(false);

        throw new Error("NO_CORRESPONDING_DEP");
      }
      setSelectedDepartment(department);
      setIsGeolocLoading(false);
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
      setIsGeolocLoading(false);
    }
  };

  const useGeoloc = async () => {
    try {
      setError("");
      setIsGeolocLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("ERREUR_NOT_GRANTED");
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
                "Une erreur est survenue lors de la géolocalisation. Entre ta ville manuellement."
              )
            );
            resetData();
            setIsGeolocLoading(false);
          }
        }
      }
      throw new Error("ERREUR");
    } catch (error) {
      if (error.message === "ERREUR_NOT_GRANTED") {
        setError(
          t(
            "Onboarding.error_geoloc_acces",
            "Une erreur est survenue lors de la géolocalisation. Vérifie dans tes réglages que tu as bien activé la géolocalisation."
          )
        );
      } else {
        setError(
          t(
            "Onboarding.error_geoloc",
            "Une erreur est survenue lors de la géolocalisation. Entre ta ville manuellement."
          )
        );
      }
      resetData();
      setIsGeolocLoading(false);
    }
  };

  const navigateToNextScreen = () =>
    props.isOnboardingScreen
      ? props.navigation.navigate("FilterAge")
      : props.navigation.goBack();

  const onValidate = () => {
    if (selectedCity && selectedDepartment) {
      dispatch(
        saveUserLocationActionCreator({
          city: selectedCity,
          dep: selectedDepartment,
        })
      );
      return navigateToNextScreen();
    }
    dispatch(removeUserLocationActionCreator());
    return navigateToNextScreen();
  };

  const isOnValidateDisabled = userLocation.city === selectedCity;
  return (
    <ContentContainer>
      <View>
        <Title>{t("Onboarding.ville", "Dans quelle ville habites-tu ?")}</Title>
        {!selectedCity && !isGeolocLoading && (
          <View>
            <SearchBarCity
              enteredText={enteredText}
              onChangeText={onChangeText}
              suggestions={suggestions}
              selectSuggestion={onSelectSuggestion}
            />
            {!enteredText && (
              <GeolocContainer onPress={useGeoloc}>
                <Icon
                  name="navigation-2-outline"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={theme.colors.black}
                />
                <GeolocText isRTL={isRTL}>
                  {t("Onboarding.position", "Utiliser ma position")}
                </GeolocText>
              </GeolocContainer>
            )}
          </View>
        )}
        {isGeolocLoading && <ActivityIndicator color={theme.colors.grey60} />}
        {!!selectedCity && !!selectedDepartment && (
          <RTLView>
            <SelectedCityContainer onPress={resetData}>
              <SelectedCityText isRTL={isRTL}>
                {selectedCity + " (" + selectedDepartment + ")"}
              </SelectedCityText>
              <Icon
                name="close-outline"
                fill={theme.colors.white}
                height={24}
                width={24}
              />
            </SelectedCityContainer>
          </RTLView>
        )}

        {!enteredText && !isGeolocLoading && (
          <Explaination
            step={1}
            defaultText="C’est pour te montrer les associations et les activités dans ta ville."
          />
        )}
      </View>
      <View>
        {!!error && <ErrorComponent text={error} />}

        {props.isOnboardingScreen ? (
          <>
            <OnboardingProgressBar step={1} />
            <BottomButtons
              isRightButtonDisabled={!selectedCity || !selectedDepartment}
              onLeftButtonClick={onValidate}
              onRightButtonClick={onValidate}
            />
          </>
        ) : (
          <BottomButtonsContainer>
            <ValidateButtonContainer>
              <CustomButton
                i18nKey={"Valider"}
                defaultText="Valider"
                textColor={
                  isOnValidateDisabled ? theme.colors.black : theme.colors.white
                }
                onPress={() => {
                  if (isOnValidateDisabled) return;
                  onValidate();
                }}
                backgroundColor={
                  isOnValidateDisabled
                    ? theme.colors.grey60
                    : theme.colors.darkBlue
                }
                iconName="arrow-forward-outline"
              />
            </ValidateButtonContainer>

            <CustomButton
              i18nKey={"Annuler"}
              defaultText="Annuler"
              textColor={theme.colors.black}
              onPress={props.navigation.goBack}
              isTextNotBold={true}
            />
          </BottomButtonsContainer>
        )}
      </View>
    </ContentContainer>
  );
};
