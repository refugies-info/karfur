import React, { useState, useCallback, useMemo } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Share, View } from "react-native";
import { ProfileParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import {
  ButtonDSFR,
  Columns,
  Flag,
  LanguageDetailsButton,
  Page,
  RTLView,
  Rows,
  RowsSpacing,
  Select,
  Separator,
  Spacer,
  TextDSFR_MD,
  TextDSFR_MD_Med,
  Title,
} from "../../components";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";
import { activatedLanguages } from "../../data/languagesData";
import { SeparatorSpacing } from "../../components/layout/Separator/Separator";
import { storeUrl } from "../../data/storeLinks";

const FlagBackground = styled.View`
  background-color: ${({ theme }) => theme.colors.dsfr_borderGrey};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const LanguagesContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.margin * 2}px;
  ${({ theme }) => theme.shadows.sm_dsfr};
`;

export const ShareScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "ShareScreen">) => {
  const theme = useTheme();
  const { t, isRTL } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  const [open, setOpen] = useState(false);
  const [selectedShareLanguage, setSelectedShareLanguage] = useState<string>(
    selectedLanguageI18nCode || "fr"
  );

  const selectLanguage = useCallback((selectedCode: string) => {
    setSelectedShareLanguage(selectedCode);
    setOpen(false);
  }, []);

  const share = useCallback(
    () => Share.share({ title: selectedShareLanguage, message: storeUrl }),
    [selectedShareLanguage]
  );

  const selectedLanguage = useMemo(
    () => getSelectedLanguageFromI18nCode(selectedShareLanguage),
    [selectedShareLanguage]
  );

  return (
    <Page
      headerTitle="Partager"
      headerIconName="gift-outline"
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
    >
      <Rows verticalAlign="space-between" spacing={RowsSpacing.Text}>
        <View>
          <Title>En quelle langue souhaites-tu envoyer l’application ?</Title>
          <Select
            label="Langue du message"
            onPress={() => setOpen((o) => !o)}
            testID="test-change-language"
          >
            <Columns RTLBehaviour layout="auto" verticalAlign="center">
              <FlagBackground>
                <Flag langueFr={selectedLanguage.langueFr} />
              </FlagBackground>
              <RTLView>
                <TextDSFR_MD_Med>{selectedLanguage.langueLoc}</TextDSFR_MD_Med>
                <TextDSFR_MD style={{ color: theme.colors.dsfr_mentionGrey }}>
                  {!isRTL
                    ? " - " + selectedLanguage.langueFr
                    : selectedLanguage.langueFr + " - "}
                </TextDSFR_MD>
              </RTLView>
            </Columns>
          </Select>
        </View>

        {open && (
          <LanguagesContainer>
            {activatedLanguages.map((language, index) => {
              const isSelected = selectedShareLanguage === language.i18nCode;
              return (
                <View key={language.langueFr}>
                  <LanguageDetailsButton
                    flatStyle
                    hideRadio
                    isSelected={isSelected}
                    langueFr={language.langueFr}
                    langueLoc={language.langueLoc}
                    langueCode={language.i18nCode}
                    onPress={() => selectLanguage(language.i18nCode)}
                    iconOverride={isSelected ? "checkmark-outline" : undefined}
                  />
                  {index !== activatedLanguages.length - 1 && (
                    <Separator fullWidth spacing={SeparatorSpacing.NoSpace} />
                  )}
                </View>
              );
            })}
          </LanguagesContainer>
        )}

        <View>
          <Spacer height={theme.margin * 2} />
          <ButtonDSFR
            title="Partager l'application"
            accessibilityLabel="Partager l'application"
            priority="primary"
            iconName="arrow-forward-outline"
            iconAfter
            onPress={share}
            style={{ width: "100%" }}
          />
          <Spacer height={theme.margin * 2} />
          <ButtonDSFR
            title={t("global.cancel")}
            accessibilityLabel={t("global.cancel")}
            onPress={() => navigation.navigate("ProfilScreen")}
            priority="tertiary no outline"
            style={{ width: "100%" }}
          />
        </View>
      </Rows>
    </Page>
  );
};
