import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";
import { CustomButton, Page, Rows } from "../../components";
import {
  removeUserLocalizedWarningHiddenActionCreator,
  removeUserLocationActionCreator,
  saveUserLocationActionCreator,
} from "../../services/redux/User/user.actions";
import { userLocationSelector } from "../../services/redux/User/user.selectors";
import { styles } from "../../theme";
import { useTheme } from "styled-components/native";

export const CityProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "CityProfilScreen">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();
  const theme = useTheme();
  const userLocation = useSelector(userLocationSelector);

  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");

  const onValidate = () => {
    if (selectedCity && selectedDepartment) {
      dispatch(
        saveUserLocationActionCreator({
          city: selectedCity,
          dep: selectedDepartment,
          shouldFetchContents: true,
        })
      );
    } else {
      dispatch(removeUserLocationActionCreator(true));
    }
    dispatch(removeUserLocalizedWarningHiddenActionCreator());
    navigation.goBack();
  };

  const isOnValidateDisabled =
    userLocation.city === selectedCity || (!userLocation.city && !selectedCity);
  return (
    <Page
      headerTitle={t("profile_screens.city", "Ville")}
      headerIconName="pin-outline"
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
    >
      <Rows layout="1 auto">
        <FilterCityComponent
          selectedCity={selectedCity}
          selectedDepartment={selectedDepartment}
          setSelectedCity={setSelectedCity}
          setSelectedDepartment={setSelectedDepartment}
        />

        <Rows>
          <CustomButton
            i18nKey="global.validate"
            defaultText="Valider"
            textColor={styles.colors.white}
            onPress={() => {
              if (isOnValidateDisabled) return;
              onValidate();
            }}
            backgroundColor={styles.colors.darkBlue}
            iconName="checkmark-outline"
            isDisabled={isOnValidateDisabled}
            iconFirst={true}
          />

          <CustomButton
            i18nKey="global.cancel"
            defaultText="Annuler"
            textColor={styles.colors.black}
            onPress={navigation.goBack}
            isTextNotBold={true}
            isDisabled={isOnValidateDisabled}
          />
        </Rows>
      </Rows>
    </Page>
  );
};
