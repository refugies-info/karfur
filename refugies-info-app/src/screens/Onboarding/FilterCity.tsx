import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { OnboardingParamList, GoogleAPISuggestion } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { RTLTouchableOpacity, RTLView } from "../../components/BasicComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { theme } from "../../theme";
import {
  TextSmallBold,
  StyledTextSmallBold,
} from "../../components/StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { Explaination } from "../../components/Onboarding/Explaination";
import { SearchBarCity } from "../../components/Onboarding/SearchBarCity";
import {
  getCitiesFromGoogleAPI,
  getCityDetailsFromGoogleAPI,
  getPlaceIdFromLocationFromGoogleAPI,
} from "../../utils/API";
import * as Location from "expo-location";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import {
  ContentContainer,
  Title,
} from "../../components/Onboarding/SharedStyledComponents";
import { ErrorComponent } from "../../components/ErrorComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserLocationActionCreator,
  removeUserLocationActionCreator,
} from "../../services/redux/User/user.actions";
import { userLocationSelector } from "../../services/redux/User/user.selectors";

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
  margin-right: ${theme.margin}px;
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

  const navigateToNextScreen = () => navigation.navigate("FilterAge");

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

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        iconName={"person-outline"}
        text={t("Onboarding.Créer mon profil", "Créer mon profil")}
      />
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
                <SelectedCityText>
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

          <OnboardingProgressBar step={1} />
          <BottomButtons
            isRightButtonDisabled={!selectedCity || !selectedDepartment}
            onLeftButtonClick={onValidate}
            onRightButtonClick={onValidate}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
