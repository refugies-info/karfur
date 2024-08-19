import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextBigBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList, FrenchLevel } from "../../../types";
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
import { ScrollView, View } from "react-native";
import { FilterButton } from "../../components/Onboarding/FilterButton";
import { Explaination } from "../../components/Onboarding/Explaination";

const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 2}px;
`;

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "FrenchLevelProfilScreen">) => {
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
    dispatch(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelName,
        shouldFetchContents: true,
      })
    );

    return navigation.goBack();
  };

  const removeFrenchLevel = () => {
    if (!selectedFrenchLevel) return;
    dispatch(removeUserFrenchLevelActionCreator(true));
    return navigation.goBack();
  };

  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Niveau de français", "Niveau de français")}
        iconName="message-circle-outline"
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginHorizontal: theme.margin * 3,
            marginTop: theme.margin * 3
          }}
        >
          <Title>
            {t("Onboarding.niveauFrancais", "Quel est ton niveau en français ?")}
          </Title>
          <Explaination
            step={3}
            defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
          />
        </View>
        <ScrollView
           style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: theme.margin * 2,
            paddingHorizontal: theme.margin * 3,
          }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <View accessibilityRole="radiogroup">
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
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
