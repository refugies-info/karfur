import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ageFilters } from "../../data/filtersData";
import { Explaination } from "../../components/Onboarding/Explaination";
import { useDispatch, useSelector } from "react-redux";
import { userAgeSelector } from "../../services/redux/User/user.selectors";
import {
  saveUserAgeActionCreator,
  removeUserAgeActionCreator,
} from "../../services/redux/User/user.actions";
import { FilterButton, Page, RadioGroup, Title } from "../../components";
import { GetContentsForAppRequest } from "@refugies-info/api-types";

export const AgeProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "AgeProfilScreen">) => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRTL();
  const userAge = useSelector(userAgeSelector);
  const [selectedAge, setSelectedAge] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userAge) setSelectedAge(userAge);
  }, [userAge]);

  const removeAge = () => {
    if (!selectedAge) return;
    dispatch(removeUserAgeActionCreator(true));
    return navigation.goBack();
  };

  const onValidateAge = (age: GetContentsForAppRequest["age"]) => {
    if (selectedAge === age) return;
    dispatch(saveUserAgeActionCreator({ age, shouldFetchContents: true }));
    return navigation.goBack();
  };

  return (
    <Page
      headerTitle={t("profile_screens.age", "Âge")}
      headerIconName="calendar-outline"
    >
      <Title>{t("onboarding_screens.age", "Quel âge as-tu ?")}</Title>
      <Explaination
        step={2}
        defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
      />
      <RadioGroup>
        {ageFilters.map((age) => (
          <FilterButton
            key={age.name}
            text={age.name}
            isSelected={age.key === selectedAge}
            onPress={() => onValidateAge(age.key)}
          />
        ))}
        <FilterButton
          text="no_age_filter"
          isSelected={!selectedAge}
          onPress={removeAge}
        />
      </RadioGroup>
    </Page>
  );
};
