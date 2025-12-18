import * as Location from "expo-location";
import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { getPlaceFromLocationFromGeoAPI } from "~/utils/API";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { ReadableText } from "../../ReadableText";
import { TextDSFR_MD_Med, TextDSFR_XS } from "../../StyledText";

const GeolocButtonContainer = styled(RTLTouchableOpacity)<{
  hasError: boolean;
}>`
  align-items: center;
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ hasError, theme }) => (hasError ? theme.colors.dsfr_error : "transparent")};
  justify-content: space-between;
  gap: ${({ theme }) => theme.margin * 2}px;
`;

const GeolocText = styled(TextDSFR_MD_Med)`
  color: ${({ theme }) => theme.colors.dsfr_blueSun113};
  flex-grow: 1;
`;

const ErrorText = styled(TextDSFR_XS)`
  color: ${({ theme }) => theme.colors.dsfr_error};
  margin-top: ${({ theme }) => theme.margin}px;
  margin-bottom: ${({ theme }) => theme.margin * 3}px;
`;

const ICON_SIZE = 24;

interface Props {
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onError: () => void;
}

const GeolocButton = ({ setSelectedCity, setSelectedDepartment, setLoading, onError }: Props) => {
  const [error, setError] = React.useState("");
  const { t, isRTL } = useTranslationWithRTL();

  const useGeoloc = async () => {
    try {
      setError("");
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("ERREUR_NOT_GRANTED");
      }

      const location = await Location.getCurrentPositionAsync({});
      if (location && location.coords && location.coords.latitude && location.coords.longitude) {
        const result = await getPlaceFromLocationFromGeoAPI(
          location.coords.longitude,
          location.coords.latitude,
        );

        if (result && result.data && result.data.features && result.data.features.length > 0) {
          const firstFeature = result.data.features[0];
          const department = firstFeature.properties.context.split(", ")[1];
          const city = firstFeature.properties.city;

          if (!department || !city) {
            throw new Error("NO_CORRESPONDING_DEP");
          }
          setSelectedDepartment(department);
          setSelectedCity(city);
          setLoading(false);
          return;
        }
      }
      throw new Error("ERREUR");
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "ERREUR_NOT_GRANTED") {
        setError(
          t(
            "onboarding_screens.error_geoloc_acces",
            "Une erreur est survenue lors de la géolocalisation. Vérifie dans tes réglages que tu as bien activé la géolocalisation.",
          ),
        );
      } else {
        setError(
          t(
            "onboarding_screens.error_geoloc",
            "Une erreur est survenue lors de la géolocalisation. Entre ta ville manuellement.",
          ),
        );
      }
      onError();
      setLoading(false);
    }
  };

  return (
    <View>
      <GeolocButtonContainer onPress={useGeoloc} hasError={!!error} accessibilityRole="button">
        <Icon
          name="pin"
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={styles.colors.dsfr_blueSun113}
        />
        <GeolocText>
          <ReadableText>
            {t("onboarding_screens.position_button", "Utiliser ma position")}
          </ReadableText>
        </GeolocText>
        <Icon
          name={!isRTL ? "chevron-right-outline" : "chevron-left-outline"}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={styles.colors.dsfr_blueSun113}
        />
      </GeolocButtonContainer>

      {!!error && <ErrorText>{error}</ErrorText>}
    </View>
  );
};

export default GeolocButton;
