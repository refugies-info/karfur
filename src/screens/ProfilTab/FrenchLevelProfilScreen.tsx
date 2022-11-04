import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextBigBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList, FrenchLevel } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { styles } from "../../theme";
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
  margin-bottom: ${styles.margin * 2}px;
`;

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "FrenchLevelProfilScreen">) => {
  const [selectedFrenchLevel, setSelectedFrenchLevel] =
    React.useState<null | FrenchLevel>(null);

  const dispatch = useDispatch();

  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  React.useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.filter(
        (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
      );
      if (formattedLevel.length > 0) {
        setSelectedFrenchLevel(formattedLevel[0]);
      }
    }
  }, [userFrenchLevel]);

  const onValidateFrenchLevel = (frenchLevelKey: string) => {
    if (selectedFrenchLevel && selectedFrenchLevel.key === frenchLevelKey)
      return;
    dispatch(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelKey,
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
        text={t("profile_screens.french_level", "Niveau de français")}
        iconName="message-circle-outline"
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginHorizontal: styles.margin * 3,
            marginTop: styles.margin * 3,
          }}
        >
          <Title>
            {t(
              "onboarding_screens.french_level",
              "Quel est ton niveau en français ?"
            )}
          </Title>
          <Explaination
            step={3}
            defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
          />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: styles.margin * 2,
            paddingHorizontal: styles.margin * 3,
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
                  frenchLevel.key === selectedFrenchLevel.key
                }
                onPress={() => onValidateFrenchLevel(frenchLevel.key)}
                details={frenchLevel.cecrCorrespondency}
              />
            ))}
            <FilterButton
              text="no_french_level_filter"
              isSelected={!selectedFrenchLevel}
              onPress={removeFrenchLevel}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
