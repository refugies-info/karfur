import { StackScreenProps } from "@react-navigation/stack";
import { GetContentsForAppRequest } from "@refugies-info/api-types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { Page } from "~/components";
import { FilterAgeComponent } from "~/components/Profil/FilterAgeComponent";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { saveUserAgeActionCreator } from "~/services/redux/User/user.actions";
import { userAgeSelector } from "~/services/redux/User/user.selectors";
import { ProfileParamList } from "~/types/navigation";

export const AgeProfilScreen = ({ navigation }: StackScreenProps<ProfileParamList, "AgeProfilScreen">) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const userAge = useSelector(userAgeSelector);
  const [selectedAge, setSelectedAge] = React.useState<GetContentsForAppRequest["age"] | undefined>(undefined);

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
      <FilterAgeComponent selectedAge={selectedAge} onAgeClick={onValidateAge} />
    </Page>
  );
};
