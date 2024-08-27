import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getDepartementFromResult } from "~/libs/geolocalisation";
import { userLocationSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { GoogleAPISuggestion } from "~/types/navigation";
import { getCitiesFromGoogleAPI, getCityDetailsFromGoogleAPI } from "~/utils/API";
import { RTLView } from "../BasicComponents";
import { ErrorComponent } from "../ErrorComponent";
import { Tag } from "../formulaire";
import { Rows } from "../layout";
import { Explaination } from "../Onboarding/Explaination";
import { SearchBarCity } from "../Onboarding/SearchBarCity";
import { Label, Title } from "../Onboarding/SharedStyledComponents";
import { ReadableText } from "../ReadableText";
import CityChoice from "./CityChoice";
import GeolocButton from "./GeolocButton";

const CITIES = [
  { city: "Paris", department: "Paris" },
  { city: "Lyon", department: "Rhône" },
  { city: "Marseille", department: "Bouches-du-Rhône" },
  { city: "Bordeaux", department: "Gironde" },
  { city: "Rennes", department: "Ille-et-Vilaine" },
  { city: "Toulouse", department: "Haute-Garonne" },
  { city: "Lille", department: "Nord" },
  { city: "Strasbourg", department: "Bas-Rhin" },
  { city: "Nantes", department: "Loire-Atlantique" },
  { city: "Nice", department: "Alpes-Maritimes" },
  { city: "Metz", department: "Moselle" },
  { city: "Grenoble", department: "Isère" },
  { city: "Dijon", department: "Côte-d'Or" },
  { city: "Mulhouse", department: "Haut-Rhin" },
  { city: "Creil", department: "Oise" },
  { city: "Charleville-Mezieres", department: "Ardennes" },
  { city: "Angers", department: "Maine-et-Loire" },
  { city: "Montpellier", department: "Hérault" },
  { city: "Brest", department: "Finistère" },
  { city: "Saint-Denis", department: "Seine-Saint-Denis" },
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
  const [suggestions, setSuggestions] = React.useState<GoogleAPISuggestion[]>([]);
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
    if (results && results.data && results.data.result && results.data.result.address_components) {
      const department = getDepartementFromResult(results.data.result.address_components);

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
      await setCityAndGetDepartment(suggestion.structured_formatting.main_text, suggestion.place_id);
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
          <ReadableText>{t("onboarding_screens.ville", "Tu habites dans quelle ville ?")}</ReadableText>
        </Title>
        <Explaination step={1} defaultText="C’est pour te montrer les associations et les activités dans ta ville." />
        <Label>
          <ReadableText>{t("onboarding_screens.city_label", "Ta ville")}</ReadableText>
        </Label>
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
            <Tag onRemove={resetData} accessibilityLabel={t("global.reinitialize")}>
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
