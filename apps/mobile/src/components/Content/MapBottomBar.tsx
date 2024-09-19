import * as Linking from "expo-linking";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { MarkerGoogle } from "~/types/interface";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { CustomButton } from "../CustomButton";
import { TextDSFR_MD } from "../StyledText";
import { MapContentFromHtml } from "./MapContentHtml";

interface Props {
  selectedMarker: MarkerGoogle | null;
  textColor: string;
  hideSideBar: () => void;
}

export const callNumber = (phone: string) => {
  let phoneNumber = `tel:${phone}`;

  Linking.canOpenURL(phoneNumber).then((supported) => {
    if (!supported) {
      return;
    }
    return Linking.openURL(phoneNumber);
  });
};

const ICON_SIZE = 24;

const MainContainer = styled.View<{ isSelected: boolean }>`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ isSelected }) => (isSelected ? styles.margin * 3 : 0)}px;
`;

const ContentContainer = styled(RTLView)<{
  color?: string; // FIXME is it necessary ?
  marginBottom?: number;
  marginTop?: number;
}>`
  margin-bottom: ${({ marginBottom, theme }) =>
    marginBottom !== undefined ? theme.margin * marginBottom : theme.margin}px;
  margin-top: ${({ marginTop, theme }) => (marginTop !== undefined ? theme.margin * marginTop : theme.margin)}px;
  align-items: flex-start;
`;

const ContentTouchableOpacity = styled(RTLTouchableOpacity)<{
  color?: string; // FIXME is it necessary ?
  marginBottom?: number;
  marginTop?: number;
}>`
  margin-bottom: ${({ marginBottom, theme }) =>
    marginBottom !== undefined ? theme.margin * marginBottom : theme.margin}px;
  margin-top: ${({ marginTop, theme }) => (marginTop !== undefined ? theme.margin * marginTop : theme.margin)}px;
  align-items: flex-start;
`;

const TextValue = styled(TextDSFR_MD)<{ color: string }>`
  margin-bottom: ${styles.margin}px;
  color: ${({ color }) => color};
`;
const TextIcon = styled(Icon)<{ isRTL: boolean }>`
  margin-right: ${({ isRTL }) => (isRTL ? 0 : styles.margin * 2)}px;
  margin-left: ${({ isRTL }) => (isRTL ? styles.margin * 2 : 0)}px;
`;

const HTMLContainer = styled.View`
  flex-grow: 0;
  flex-shrink: 1;
`;

export const MapBottomBar = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  if (!props.selectedMarker) {
    return <MainContainer isSelected={false} />;
  }
  const formattedMarkerName =
    props.selectedMarker && props.selectedMarker.nom ? props.selectedMarker.nom.replace("<br>", "") : "";
  return (
    <MainContainer isSelected={true}>
      <View style={{ marginBottom: styles.margin * 4 }}>
        <ContentContainer color={props.textColor} marginBottom={4} marginTop={0}>
          <HTMLContainer>
            <MapContentFromHtml
              htmlContent={formattedMarkerName}
              darkColor={props.textColor}
              isBold={true}
              isLarge={true}
            />
          </HTMLContainer>
        </ContentContainer>

        <ContentContainer marginTop={0}>
          <TextIcon
            name="pin-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
            accessibilityLabel={t("content_screen.address")}
          />
          <HTMLContainer>
            <TextValue color={props.textColor}>{props.selectedMarker.address}</TextValue>
          </HTMLContainer>
        </ContentContainer>

        <ContentContainer color={props.textColor} marginTop={0}>
          <TextIcon
            name="at-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
            accessibilityLabel={t("content_screen.contact_email_accessibility")}
          />
          <HTMLContainer>
            {props.selectedMarker.email ? (
              <MapContentFromHtml htmlContent={props.selectedMarker.email} darkColor={props.textColor} isBold={false} />
            ) : (
              <TextValue color={props.textColor}>{t("content_screen.not_set", "-")}</TextValue>
            )}
          </HTMLContainer>
        </ContentContainer>

        <ContentTouchableOpacity
          color={props.textColor}
          marginTop={0}
          onPress={() => {
            if (props.selectedMarker && props.selectedMarker.telephone) {
              callNumber(props.selectedMarker.telephone);
            }
          }}
          accessibilityRole="button"
        >
          <TextIcon
            name="phone-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
            accessibilityLabel={t("content_screen.phone_number_accessibility")}
          />
          <HTMLContainer>
            {props.selectedMarker.telephone ? (
              <MapContentFromHtml
                htmlContent={props.selectedMarker.telephone}
                darkColor={props.textColor}
                isBold={false}
              />
            ) : (
              <TextValue color={props.textColor}>{t("content_screen.not_set", "-")}</TextValue>
            )}
          </HTMLContainer>
        </ContentTouchableOpacity>

        {!!props.selectedMarker.description && (
          <>
            <ContentContainer color={props.textColor} marginTop={4}>
              <TextIcon name="info-outline" width={ICON_SIZE} height={ICON_SIZE} fill={props.textColor} isRTL={isRTL} />
              <HTMLContainer>
                <MapContentFromHtml
                  htmlContent={props.selectedMarker.description}
                  darkColor={props.textColor}
                  isBold={false}
                />
              </HTMLContainer>
            </ContentContainer>
          </>
        )}
      </View>

      <View style={{ alignItems: "center", paddingBottom: styles.margin * 2 }}>
        <CustomButton
          textColor={styles.colors.black}
          i18nKey="global.close"
          onPress={props.hideSideBar}
          defaultText="Fermer"
          iconName="close-outline"
          accessibilityLabel={t("content_screen.close_details_accessibility")}
          notFullWidth={true}
          iconFirst={true}
          isTextNotBold={true}
        />
      </View>
    </MainContainer>
  );
};
