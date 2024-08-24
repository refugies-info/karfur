import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import CityChoice from "../Geoloc/CityChoice";

const MainContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const InputContainer = styled(RTLView)`
  min-height: 56px;
  width: 100%;
  padding: ${styles.margin * 2}px;
  background-color: ${styles.colors.dsfr_actionLowBlue};
  border: 1px solid ${styles.colors.dsfr_action};
  flex: 1;
`;
const StyledInput = styled.TextInput<{ isRTL: boolean }>`
  height: 100%;
  width: 100%;
  color: ${styles.colors.dsfr_action};
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  margin-left: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-right: ${({ isRTL }) => (isRTL ? styles.margin : 0)}px;
  text-align: ${({ isRTL }) => (isRTL ? "right" : "left")};
  flex: 1;
`;
const FakeInput = styled(RTLTouchableOpacity)`
  min-height: 56px;
  width: 100%;
  padding: ${styles.margin * 2}px;
  background-color: ${styles.colors.white};
  border: 1px solid ${styles.colors.dsfr_borderGrey};
  justify-content: flex-start;
  align-items: center;
  ${({ theme }) => theme.shadows.sm_dsfr}
`;
const FakeInputText = styled.Text<{ isRTL: boolean }>`
  color: ${styles.colors.darkGrey};
  margin-left: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-right: ${({ isRTL }) => (isRTL ? styles.margin : 0)}px;
`;
const SuggestionsContainer = styled.ScrollView`
  margin-top: ${styles.margin}px;
`;
const TextModal = styled(Modal)`
  justify-content: flex-start;
  padding-top: ${styles.margin * 6}px;
`;

interface Props {
  enteredText: string;
  suggestions: GoogleAPISuggestion[];
  onChangeText: (data: string) => void;
  selectSuggestion: (suggestion: GoogleAPISuggestion) => void;
  geoloc: React.ReactNode;
}

export const SearchBarCity = (props: Props) => {
  const input = useRef<TextInput>();
  const [modalOpened, setModalOpened] = useState(false);
  const { t, isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    setTimeout(() => {
      if (input && input.current) input.current.focus();
    }, 100);
  }, [modalOpened]);

  const clearInput = () => props.onChangeText("");

  return (
    <View>
      <FakeInput
        onPress={() => setModalOpened(true)}
        accessibilityRole="button"
        accessibilityLabel={t("onboarding_screens.city_label", "Ta ville")}
      >
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={styles.colors.darkGrey}
        />
        <FakeInputText isRTL={isRTL}>Paris, Lyon...</FakeInputText>
      </FakeInput>

      {/* @ts-ignore (see https://github.com/react-native-modal/react-native-modal/issues/696) */}
      <TextModal
        isVisible={modalOpened}
        onBackdropPress={() => setModalOpened(false)}
        statusBarTranslucent={true}
        backdropColor={styles.colors.greyF7}
        backdropOpacity={1}
      >
        <SafeAreaView>
          <MainContainer>
            <TouchableOpacity
              onPress={() => setModalOpened(false)}
              style={{ marginRight: styles.margin }}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel={t("global.back")}
            >
              <Icon
                name="arrow-back-outline"
                height={24}
                width={24}
                fill={styles.colors.dsfr_action}
              />
            </TouchableOpacity>
            <InputContainer>
              <StyledInput
                // @ts-ignore
                ref={input}
                value={props.enteredText}
                onChangeText={props.onChangeText}
                isRTL={isRTL}
                testID="test-city-input"
              />
              <TouchableOpacity
                onPress={clearInput}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel={t("global.clear_selection_accessibility")}
              >
                <Icon
                  name="close-outline"
                  height={24}
                  width={24}
                  fill={styles.colors.dsfr_action}
                />
              </TouchableOpacity>
            </InputContainer>
          </MainContainer>
          <SuggestionsContainer
            keyboardShouldPersistTaps={"handled"}
            keyboardDismissMode="on-drag"
          >
            {props.geoloc}
            {(props.suggestions || []).map((suggestion) => (
              <CityChoice
                key={suggestion.place_id}
                city={suggestion?.structured_formatting?.main_text}
                onSelect={() => props.selectSuggestion(suggestion)}
              />
            ))}
          </SuggestionsContainer>
        </SafeAreaView>
      </TextModal>
    </View>
  );
};
