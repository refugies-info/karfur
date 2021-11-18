import * as Location from "expo-location";
import styled from "styled-components/native";
import { ScrollView } from "react-native";
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
import {
  getDepartementFromResult,
  getCityFromResult,
} from "../../libs/geolocalisation";
import {
  saveUserLocationActionCreator,
  removeUserLocationActionCreator,
  removeUserLocalizedWarningHiddenActionCreator
} from "../../services/redux/User/user.actions";
import { Title, Label } from "../Onboarding/SharedStyledComponents";
import { View, ActivityIndicator } from "react-native";
import { SearchBarCity } from "../Onboarding/SearchBarCity";
import { Icon } from "react-native-eva-icons";
import { Explaination } from "../Onboarding/Explaination";
import { ErrorComponent } from "../ErrorComponent";
import { OnboardingProgressBar } from "../Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../Onboarding/BottomButtons";
import { CustomButton } from "../CustomButton";

const GeolocContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.lightBlue};
  margin-vertical: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  align-items: center;
  box-shadow: 1px 1px 2px rgba(0.33, 0.33, 0.33, 0.4);
  elevation: 2;
  border-width: 2px;
  border-style: solid;
  border-color: ${(props: { hasError: boolean }) =>
    props.hasError ? theme.colors.red : "transparent"};
`;

const GeolocText = styled(TextSmallBold)`
  color: ${theme.colors.darkBlue};
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
      return;
    }
    throw new Error("ERREUR");
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
          result.data.results.length > 0 &&
          result.data.results[0].address_components
        ) {
          const department = getDepartementFromResult(
            result.data.results[0].address_components
          );
          const city = getCityFromResult(
            result.data.results[0].address_components
          );

          if (!department || !city) {
            throw new Error("NO_CORRESPONDING_DEP");
          }
          setSelectedDepartment(department);
          setSelectedCity(city);
          setIsGeolocLoading(false);
          return;
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
          shouldFetchContents: props.isOnboardingScreen ? false : true,
        })
      );
    } else {
      dispatch(
        removeUserLocationActionCreator(props.isOnboardingScreen ? false : true)
      );
    }
    dispatch(removeUserLocalizedWarningHiddenActionCreator());
    return navigateToNextScreen();
  };

  const isOnValidateDisabled =
    userLocation.city === selectedCity || (!userLocation.city && !selectedCity);
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        padding: theme.margin * 3,
        flexGrow: 1
      }}
    >
      <View>
        <Title>{t("Onboarding.ville", "Tu habites dans quelle ville ?")}</Title>
        <Explaination
          step={1}
          defaultText="C’est pour te montrer les associations et les activités dans ta ville."
        />
        <Label>{t("Onboarding.Ta ville", "Ta ville")}</Label>
        {!selectedCity && !isGeolocLoading && (
          <View>
            <SearchBarCity
              enteredText={enteredText}
              onChangeText={onChangeText}
              suggestions={suggestions}
              selectSuggestion={onSelectSuggestion}
            />
            {!selectedCity && (
              <GeolocContainer onPress={useGeoloc} hasError={!!error}>
                <Icon
                  name="pin"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={theme.colors.darkBlue}
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
        {!!error &&
          <View style={{ marginBottom: theme.margin * 3 }}>
            <ErrorComponent text={error} />
          </View>
        }
      </View>
      <View>

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
                textColor={theme.colors.white}
                onPress={() => {
                  if (isOnValidateDisabled) return;
                  onValidate();
                }}
                backgroundColor={theme.colors.darkBlue}
                iconName="checkmark-outline"
                isDisabled={isOnValidateDisabled}
                iconFirst={true}
              />
            </ValidateButtonContainer>

            <CustomButton
              i18nKey={"Annuler"}
              defaultText="Annuler"
              textColor={theme.colors.black}
              onPress={props.navigation.goBack}
              isTextNotBold={true}
              isDisabled={isOnValidateDisabled}
            />
          </BottomButtonsContainer>
        )}
      </View>
    </ScrollView>
  );
};
