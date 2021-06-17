import * as React from "react";
import { ScrollView } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingHeader } from "./OnboardingHeader";
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
import { saveUserFrenchLevelActionCreator } from "../../services/redux/User/user.actions";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";

const ContentContainer = styled.View`
  padding-vertical: ${theme.margin * 3}px;
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
  const [selectedFrenchLevel, setSelectedFrenchLevel] = React.useState<null | {
    name: string;
    cecrCorrespondency?: string[];
  }>(null);
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
      dispatch(saveUserFrenchLevelActionCreator(selectedFrenchLevel.name));
      navigateToNextScreen();
    }
  };
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <OnboardingHeader navigation={navigation} />
      <ContentContainer>
        <ScrollView contentContainerStyle={{ padding: theme.margin * 3 }}>
          <Title>
            {t(
              "Onboarding.niveauFrancais",
              "Quel est ton niveau en français ?"
            )}
          </Title>
          {frenchLevelFilters.map((frenchLevel) => (
            <FilterButton
              key={frenchLevel.name}
              text={frenchLevel.name}
              isSelected={
                !!selectedFrenchLevel &&
                frenchLevel.name === selectedFrenchLevel.name
              }
              onPress={() => setSelectedFrenchLevel(frenchLevel)}
              details={frenchLevel.cecrCorrespondency}
            />
          ))}
          <Explaination
            step={3}
            defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
          />
        </ScrollView>
        <BottomContainer>
          <OnboardingProgressBar step={3} />
          <BottomButtons
            isRightButtonDisabled={!selectedFrenchLevel}
            onLeftButtonClick={navigateToNextScreen}
            onRightButtonClick={onValidate}
          />
        </BottomContainer>
      </ContentContainer>
    </SafeAreaView>
  );
};
