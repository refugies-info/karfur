import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextNormalBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { RootStackParamList, FrenchLevel } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { theme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";
import { frenchLevelFilters } from "../../data/filtersData";
import {
  saveUserFrenchLevelActionCreator,
  removeUserFrenchLevelActionCreator,
} from "../../services/redux/User/user.actions";
import { ScrollView } from "react-native";
import { FilterButton } from "../../components/Onboarding/FilterButton";
import { Explaination } from "../../components/Onboarding/Explaination";

const ContentContainer = styled.View`
  padding-bottom: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const Title = styled(TextNormalBold)`
  margin-top: ${theme.margin * 3}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<RootStackParamList, "FrenchLevelProfilScreen">) => {
  const [
    selectedFrenchLevel,
    setSelectedFrenchLevel,
  ] = React.useState<null | FrenchLevel>(null);

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

  const onValidateFrenchLevel = (frenchLevelName: string) => {
    if (selectedFrenchLevel && selectedFrenchLevel.name === frenchLevelName)
      return;
    dispatch(saveUserFrenchLevelActionCreator(frenchLevelName));

    return navigation.goBack();
  };

  const removeFrenchLevel = () => {
    if (!selectedFrenchLevel) return;
    dispatch(removeUserFrenchLevelActionCreator());
    return navigation.goBack();
  };

  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Niveau de français", "Niveau de français")}
        iconName="message-circle-outline"
      />
      <ContentContainer>
        <Title>
          {t("Onboarding.niveauFrancais", "Quel est ton niveau en français ?")}
        </Title>
        <ScrollView
          contentContainerStyle={{
            paddingTop: theme.margin * 3,
            paddingHorizontal: theme.margin * 3,
          }}
        >
          {frenchLevelFilters.map((frenchLevel) => (
            <FilterButton
              key={frenchLevel.name}
              text={frenchLevel.name}
              isSelected={
                !!selectedFrenchLevel &&
                frenchLevel.name === selectedFrenchLevel.name
              }
              onPress={() => onValidateFrenchLevel(frenchLevel.name)}
              details={frenchLevel.cecrCorrespondency}
            />
          ))}
          <FilterButton
            text="Ne pas filtrer selon mon niveau de français"
            isSelected={!selectedFrenchLevel}
            onPress={removeFrenchLevel}
          />
          <Explaination
            step={3}
            defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
          />
        </ScrollView>
      </ContentContainer>
    </SafeAreaView>
  );
};
