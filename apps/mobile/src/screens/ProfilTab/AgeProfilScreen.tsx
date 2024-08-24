import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useDispatch, useSelector } from "react-redux";
import { userAgeSelector } from "../../services/redux/User/user.selectors";
import { saveUserAgeActionCreator } from "../../services/redux/User/user.actions";
import { Page } from "../../components";
import { GetContentsForAppRequest } from "@refugies-info/api-types";
import { useTheme } from "styled-components/native";
import { FilterAgeComponent } from "../../components/Profil/FilterAgeComponent";

export const AgeProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "AgeProfilScreen">) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const userAge = useSelector(userAgeSelector);
  const [selectedAge, setSelectedAge] = React.useState<
    GetContentsForAppRequest["age"] | undefined
  >(undefined);

  React.useEffect(() => {
    if (userAge) setSelectedAge(userAge);
  }, [userAge]);

  const onValidateAge = (age: GetContentsForAppRequest["age"]) => {
    if (selectedAge === age) return;
    dispatch(saveUserAgeActionCreator({ age, shouldFetchContents: true }));
    return navigation.goBack();
  };

  return (
    <Page
      headerTitle={t("profile_screens.age", "Âge")}
      headerIconName="calendar-outline"
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
    >
      <FilterAgeComponent
        selectedAge={selectedAge}
        onAgeClick={onValidateAge}
      />
    </Page>
  );
};
