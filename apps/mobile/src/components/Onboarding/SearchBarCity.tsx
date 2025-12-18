import React, { useRef, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import type { GeoAPISuggestion } from "~/types/navigation";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
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

interface StyledInputProps extends React.ComponentProps<typeof TextInput> {
  isRTL: boolean;
}

const StyledInput = styled(TextInput).attrs<StyledInputProps>(({ isRTL }) => ({
  textAlign: isRTL ? "right" : "left",
  style: {
    marginLeft: isRTL ? 0 : styles.margin,
    marginRight: isRTL ? styles.margin : 0,
  },
}))`
  height: 100%;
  width: 100%;
  color: ${styles.colors.dsfr_action};
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
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
const ModalContainer = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${styles.margin * 2}px;
  padding-vertical: ${styles.margin * 8}px;
  background-color: ${styles.colors.white};
`;

interface Props {
  enteredText: string;
  suggestions: GeoAPISuggestion[];
  onChangeText: (data: string) => void;
  selectSuggestion: (suggestion: GeoAPISuggestion) => void;
  geoloc: React.ReactNode;
}

export const SearchBarCity = (props: Props) => {
  const input = useRef<TextInput>(null);
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
        <Icon name="search-outline" height={24} width={24} fill={styles.colors.darkGrey} />
        <FakeInputText isRTL={isRTL}>Paris, Lyon...</FakeInputText>
      </FakeInput>

      <Modal
        visible={modalOpened}
        onDismiss={() => setModalOpened(false)}
        statusBarTranslucent={true}
        transparent={false}
      >
        <ModalContainer>
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
          <SuggestionsContainer keyboardShouldPersistTaps={"handled"} keyboardDismissMode="on-drag">
            {props.geoloc}
            {(props.suggestions || []).map((suggestion, index) => (
              <CityChoice
                key={index}
                city={suggestion?.properties?.city}
                onSelect={() => props.selectSuggestion(suggestion)}
              />
            ))}
          </SuggestionsContainer>
        </ModalContainer>
      </Modal>
    </View>
  );
};
