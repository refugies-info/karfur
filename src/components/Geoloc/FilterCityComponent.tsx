import * as Location from "expo-location";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { TextSmallBold, StyledTextSmallBold } from "../StyledText";
import React from "react";
import { GoogleAPISuggestion } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useSelector } from "react-redux";
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
import { Title, Label } from "../Onboarding/SharedStyledComponents";
import { View, ActivityIndicator } from "react-native";
import { SearchBarCity } from "../Onboarding/SearchBarCity";
import { Icon } from "react-native-eva-icons";
import { Explaination } from "../Onboarding/Explaination";
import { ErrorComponent } from "../ErrorComponent";
import { Rows } from "../layout";
import { ReadableText } from "../ReadableText";

const GeolocContainer = styled(RTLTouchableOpacity)<{ hasError: boolean }>`
  background-color: ${styles.colors.lightBlue};
  margin-vertical: ${styles.margin * 2}px;
  border-radius: ${styles.radius * 2}px;
  align-items: center;
  ${styles.shadows.sm}
  padding: ${styles.margin * 2 - 2}px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ hasError }) =>
    hasError ? styles.colors.red : styles.colors.lightBlue};
`;

const GeolocText = styled(TextSmallBold)<{ isRTL: boolean }>`
  color: ${styles.colors.darkBlue};
  margin-left: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-right: ${({ isRTL }) => (isRTL ? styles.margin : 0)}px;
`;

const SelectedCityContainer = styled(RTLTouchableOpacity)`
  background-color: ${styles.colors.black};
  padding: ${styles.margin * 2}px;
  border-radius: ${styles.radius * 2}px;
  margin-bottom: ${styles.margin * 4}px;
  align-items: center;
  align-self: flex-start;
`;

const SelectedCityText = styled(StyledTextSmallBold)<{ isRTL: boolean }>`
  color: ${styles.colors.white};
  margin-right: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-left: ${({ isRTL }) => (isRTL ? styles.margin : 0)}px;
`;

const ICON_SIZE = 24;

interface Props {
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  selectedDepartment: string;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>;
}

export const FilterCityComponent = ({
  selectedCity,
  setSelectedCity,
  selectedDepartment,
  setSelectedDepartment,
}: Props) => {
  const [enteredText, setEnteredText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<GoogleAPISuggestion[]>(
    []
  );
  const [error, setError] = React.useState("");
  const [isGeolocLoading, setIsGeolocLoading] = React.useState(false);
  const { t, isRTL } = useTranslationWithRTL();

  const defaultError = t("global.error", "Une erreur est survenue, réessaie.");

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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      if (error.message === "ERREUR_NOT_GRANTED") {
        setError(
          t(
            "onboarding_screens.error_geoloc_acces",
            "Une erreur est survenue lors de la géolocalisation. Vérifie dans tes réglages que tu as bien activé la géolocalisation."
          )
        );
      } else {
        setError(
          t(
            "onboarding_screens.error_geoloc",
            "Une erreur est survenue lors de la géolocalisation. Entre ta ville manuellement."
          )
        );
      }
      resetData();
      setIsGeolocLoading(false);
    }
  };

  return (
    <Rows verticalAlign="space-between">
      <View>
        <Title>
          <ReadableText>
            {t("onboarding_screens.ville", "Tu habites dans quelle ville ?")}
          </ReadableText>
        </Title>
        <Explaination
          step={1}
          defaultText="C’est pour te montrer les associations et les activités dans ta ville."
        />
        <Label>{t("onboarding_screens.city_label", "Ta ville")}</Label>
        {!selectedCity && !isGeolocLoading && (
          <View>
            <SearchBarCity
              enteredText={enteredText}
              onChangeText={onChangeText}
              suggestions={suggestions}
              selectSuggestion={onSelectSuggestion}
            />
            {!selectedCity && (
              <GeolocContainer
                onPress={useGeoloc}
                hasError={!!error}
                accessibilityRole="button"
              >
                <Icon
                  name="pin"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={styles.colors.darkBlue}
                />
                <GeolocText isRTL={isRTL}>
                  {t(
                    "onboarding_screens.position_button",
                    "Utiliser ma position"
                  )}
                </GeolocText>
              </GeolocContainer>
            )}
          </View>
        )}
        {isGeolocLoading && <ActivityIndicator color={styles.colors.grey60} />}
        {!!selectedCity && !!selectedDepartment && (
          <RTLView>
            <SelectedCityContainer
              onPress={resetData}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel={t("global.reinitialize")}
            >
              <SelectedCityText isRTL={isRTL}>
                {selectedCity + " (" + selectedDepartment + ")"}
              </SelectedCityText>
              <Icon
                name="close-outline"
                fill={styles.colors.white}
                height={24}
                width={24}
              />
            </SelectedCityContainer>
          </RTLView>
        )}
        {!!error && (
          <View style={{ marginBottom: styles.margin * 3 }}>
            <ErrorComponent text={error} />
          </View>
        )}
      </View>
    </Rows>
  );
};
