import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { TextDSFR_MD_Bold } from "../StyledText";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { LinearGradient } from "expo-linear-gradient";
import { TagImage } from "./TagImage";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { GetThemeResponse } from "@refugies-info/api-types";

interface Props {
  theme: GetThemeResponse;
  navigation: any;
  cardWidth: number;
  cardHeight: number;
}

const StyledContainer = styled(RTLView)<{ backgroundColor: string }>`
  margin-horizontal: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  margin-top: ${styles.margin * 3}px;
  padding-vertical: ${styles.margin * 2}px;
  padding-horizontal: ${styles.margin}px;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  border-radius: ${styles.radius * 2}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${styles.shadows.lg}
`;

const StyledText = styled(TextDSFR_MD_Bold)`
  color: ${({ theme }) => theme.colors.white};
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  flex-shrink: 1;
  flex-grow: 0;
`;
const CardGradient = styled(LinearGradient)<{ width: number; height: number }>`
  justify-content: flex-end;
  align-items: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
`;

const CarousselCardComponent = (props: Props) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={props.theme.name[currentLanguageI18nCode || "fr"]}
      activeOpacity={0.7}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: props.theme.name.fr,
          view: "carousel",
        });
        props.navigation.navigate("NeedsScreen", {
          theme: props.theme,
        });
        return;
      }}
    >
      <CardGradient
        colors={[props.theme.colors.color60, props.theme.colors.color80]}
        width={props.cardWidth}
        height={props.cardHeight}
      >
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <TagImage theme={props.theme} />
        </View>
        <StyledContainer backgroundColor={props.theme.colors.color100}>
          <StyledText>
            {firstLetterUpperCase(
              props.theme.name[currentLanguageI18nCode || "fr"]
            )}
          </StyledText>
          {props.theme.icon && (
            <StreamlineIcon icon={props.theme.icon} size={20} />
          )}
        </StyledContainer>
      </CardGradient>
    </TouchableOpacity>
  );
};

export const CarousselCard = React.memo(CarousselCardComponent);
