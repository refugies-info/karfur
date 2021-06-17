import * as React from "react";
import { SmallButton } from "../../components/SmallButton";
import { RowContainer, RTLView } from "../../components/BasicComponents";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { StyledTextSmall } from "../../components/StyledText";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const TopButtonsContainer = styled(RowContainer)`
  justify-content: space-between;
  margin-top: ${theme.margin}px;
  padding-horizontal: ${theme.margin * 3}px;
`;

const StyledText = styled(StyledTextSmall)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const ICON_SIZE = 24;

export const OnboardingHeader = (props: { navigation: any }) => {
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <TopButtonsContainer>
      <SmallButton
        iconName="arrow-back-outline"
        onPress={props.navigation.goBack}
      />
      <RTLView>
        <Icon
          name={"person-outline"}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={theme.colors.black}
        />
        <StyledText isRTL={isRTL}>
          {t("Onboarding.Créer mon profil", "Créer mon profil")}
        </StyledText>
      </RTLView>
      <SmallButton iconName="volume-up-outline" />
    </TopButtonsContainer>
  );
};
