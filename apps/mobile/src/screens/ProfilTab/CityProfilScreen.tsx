import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";
import { Page, Rows } from "../../components";
import {
  removeUserLocalizedWarningHiddenActionCreator,
  saveUserLocationActionCreator,
} from "../../services/redux/User/user.actions";
import { userLocationSelector } from "../../services/redux/User/user.selectors";
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

  React.useEffect(() => {
    const onValidate = () => {
      if (selectedCity && selectedDepartment) {
        dispatch(
          saveUserLocationActionCreator({
            city: selectedCity,
            dep: selectedDepartment,
            shouldFetchContents: true,
          })
        );
      }
      dispatch(removeUserLocalizedWarningHiddenActionCreator());
      navigation.goBack();
    };

    if (
      selectedCity &&
      userLocation.city !== selectedCity &&
      selectedDepartment
    ) {
      onValidate();
    }
  }, [selectedCity, selectedDepartment]);

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
      </Rows>
    </Page>
  );
};
