import * as React from "react";
import { ScrollView } from "react-native";
import { OnboardingParamList, FrenchLevel } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { frenchLevelFilters } from "../../data/filtersData";
import { FilterButton } from "../../components/Onboarding/FilterButton";
import { Explaination } from "../../components/Onboarding/Explaination";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserFrenchLevelActionCreator,
  removeUserFrenchLevelActionCreator,
} from "../../services/redux/User/user.actions";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";

const ContentContainer = styled.View`
  padding-bottom: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const BottomContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  margin-top: ${theme.margin}px;
`;

export const FilterFrenchLevel = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const [
    selectedFrenchLevel,
    setSelectedFrenchLevel,
  ] = React.useState<null | FrenchLevel>(null);
  const { t } = useTranslationWithRTL();

  const navigateToNextScreen = () => navigation.navigate("FinishOnboarding");

  const dispatch = useDispatch();

  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  React.useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.filter(
        (frenchLevelFilter) => frenchLevelFilter.name === userFrenchLevel
      );
      if (formattedLevel.length > 0) {
        setSelectedFrenchLevel(formattedLevel[0]);
      }
    }
  }, [userFrenchLevel]);

  const onValidate = () => {
    if (selectedFrenchLevel) {
      dispatch(
        saveUserFrenchLevelActionCreator({
          frenchLevel: selectedFrenchLevel.name,
          shouldFetchContents: false,
        })
      );
      return navigateToNextScreen();
    }
    dispatch(removeUserFrenchLevelActionCreator(false));
    return navigateToNextScreen();
  };

  const onSelectFrenchLevel = (frenchLevel: FrenchLevel) => {
    if (selectedFrenchLevel && selectedFrenchLevel.name === frenchLevel.name) {
      setSelectedFrenchLevel(null);
      return;
    }

    setSelectedFrenchLevel(frenchLevel);
    return;
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
        <ScrollView
          contentContainerStyle={{ padding: theme.margin * 3 }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <Title>
            {t(
              "Onboarding.niveauFrancais",
              "Quel est ton niveau en français ?"
            )}
          </Title>
          <Explaination
            step={3}
            defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
          />
          {frenchLevelFilters.map((frenchLevel) => (
            <FilterButton
              key={frenchLevel.name}
              text={frenchLevel.name}
              isSelected={
                !!selectedFrenchLevel &&
                frenchLevel.name === selectedFrenchLevel.name
              }
              onPress={() => onSelectFrenchLevel(frenchLevel)}
              details={frenchLevel.cecrCorrespondency}
            />
          ))}
        </ScrollView>
        <BottomContainer>
          <OnboardingProgressBar step={3} />
          <BottomButtons
            isRightButtonDisabled={!selectedFrenchLevel}
            onLeftButtonClick={onValidate}
            onRightButtonClick={onValidate}
          />
        </BottomContainer>
      </ContentContainer>
    </SafeAreaView>
  );
};
