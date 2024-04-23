import { useTheme } from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import React, { useMemo } from "react";
import { GoogleAPISuggestion } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useSelector } from "react-redux";
import { userLocationSelector } from "../../services/redux/User/user.selectors";
import {
  getCitiesFromGoogleAPI,
  getCityDetailsFromGoogleAPI,
} from "../../utils/API";
import { getDepartementFromResult } from "../../libs/geolocalisation";
import { Title, Label } from "../Onboarding/SharedStyledComponents";
import { View, ActivityIndicator } from "react-native";
import { SearchBarCity } from "../Onboarding/SearchBarCity";
import { Explaination } from "../Onboarding/Explaination";
import { ErrorComponent } from "../ErrorComponent";
import { Rows } from "../layout";
import { ReadableText } from "../ReadableText";
import { Tag } from "../formulaire";
import GeolocButton from "./GeolocButton";
import CityChoice from "./CityChoice";

const CITIES = [
  { city: "Paris", department: "Paris" },
  { city: "Lyon", department: "Rhône" },
  { city: "Saint-Denis", department: "Seine-Saint-Denis" },
  { city: "Strasbourg", department: "Bas-Rhin" },
  { city: "Nantes", department: "Loire-Atlantique" },
];

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
  const theme = useTheme();
  const [enteredText, setEnteredText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<GoogleAPISuggestion[]>(
    []
  );
  const [error, setError] = React.useState("");
  const [isGeolocLoading, setIsGeolocLoading] = React.useState(false);
  const { t } = useTranslationWithRTL();

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

  const onSelectItem = (city: string, department: string) => {
    setSelectedCity(city);
    setSelectedDepartment(department);
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

  const geoloc = useMemo(() => {
    return (
      <GeolocButton
        setSelectedCity={setSelectedCity}
        setSelectedDepartment={setSelectedDepartment}
        setLoading={setIsGeolocLoading}
        onError={() => resetData()}
      />
    );
  }, [setSelectedCity, setSelectedDepartment, setIsGeolocLoading, resetData]);

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
        {!selectedCity && (
          <View>
            <SearchBarCity
              enteredText={enteredText}
              onChangeText={onChangeText}
              suggestions={suggestions}
              selectSuggestion={onSelectSuggestion}
              geoloc={geoloc}
            />
            <View style={{ marginTop: theme.margin * 3 }}>
              {geoloc}
              {CITIES.map((data) => (
                <CityChoice
                  key={data.city}
                  city={data.city}
                  department={data.department}
                  onSelect={() => onSelectItem(data.city, data.department)}
                />
              ))}
            </View>
          </View>
        )}
        {isGeolocLoading && <ActivityIndicator color={styles.colors.grey60} />}
        {!!selectedCity && !!selectedDepartment && (
          <RTLView>
            <Tag
              onRemove={resetData}
              accessibilityLabel={t("global.reinitialize")}
            >
              {selectedCity + " (" + selectedDepartment + ")"}
            </Tag>
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
