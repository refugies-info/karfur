import React, { useCallback, useMemo, useState } from "react";
import { Share, Platform, View } from "react-native";
import { GetThemeResponse, Id, ViewsType } from "@refugies-info/api-types";
import { Trans } from "react-i18next";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  RTLView,
  ReadButton,
  TextSmallBold,
  TextSmallNormal,
  Toast,
} from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import { styles } from "../../../theme";
import { logEventInFirebase } from "../../../utils/logEvent";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";
import { noVoiceover } from "../../../libs/noVoiceover";
import {
  currentI18nCodeSelector,
  selectedContentSelector,
} from "../../../services";
import {
  isFavorite,
  userFavorites,
} from "../../../services/redux/User/user.selectors";
import {
  addUserFavoriteActionCreator,
  removeUserFavoriteActionCreator,
  saveUserHasNewFavoritesActionCreator,
  setRedirectDispositifActionCreator,
} from "../../../services/redux/User/user.actions";
import { updateNbVuesOrFavoritesOnContent } from "../../../utils/API";
import Config from "../../../libs/getEnvironment";
import { BottomTabParamList } from "../../../../types";

const TabBarContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.shadows.xs}
  z-index: 14;
`;
const ToastText = styled(TextSmallNormal)`
  color: ${({ theme }) => theme.colors.white};
`;
const ToastTextBold = styled(TextSmallBold)`
  color: ${({ theme }) => theme.colors.white};
`;

interface Props {
  contentId: string;
  theme?: GetThemeResponse;
  needId: Id;
}

type ContentScreenNavigationProp = StackNavigationProp<BottomTabParamList>;

export const ContentTabBar = ({ contentId, needId, theme }: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ContentScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslationWithRTL();

  const currentLanguage = useSelector(currentI18nCodeSelector);
  const selectedContent = useSelector(selectedContentSelector(currentLanguage));
  const noReadButton = useMemo(
    () => noVoiceover(currentLanguage),
    [currentLanguage]
  );

  const favorites = useSelector(userFavorites);
  const [favoriteToast, setFavoriteToast] = useState("");
  const isContentFavorite = useSelector(isFavorite(contentId));

  const toggleFavorites = () => {
    if (isContentFavorite) {
      setFavoriteToast("removed");
      dispatch(removeUserFavoriteActionCreator(contentId));
    } else {
      setFavoriteToast("added");
      if (favorites.length === 0) {
        dispatch(saveUserHasNewFavoritesActionCreator());
      }
      dispatch(addUserFavoriteActionCreator(contentId));
      updateNbVuesOrFavoritesOnContent(contentId, ViewsType.FAVORITE);

      logEventInFirebase(FirebaseEvent.ADD_FAVORITE, {
        contentId: contentId || "unknown",
      });
    }
  };

  // SHARE
  const shareContent = useCallback(async () => {
    if (!selectedContent) return;
    logEventInFirebase(FirebaseEvent.SHARE_CONTENT, {
      titreInformatif: selectedContent.titreInformatif,
      contentId: selectedContent._id,
    });

    let urlType: string = selectedContent.typeContenu;
    if (currentLanguage !== "fr") {
      urlType =
        selectedContent.typeContenu === "demarche" ? "procedure" : "program";
    }
    try {
      const shareData =
        Platform.OS === "ios"
          ? {
              message: `${selectedContent.titreInformatif}`,
              url: `${Config.siteUrl}/${currentLanguage}/${urlType}/${selectedContent._id}`,
            }
          : {
              title: `${selectedContent.titreInformatif}`,
              message: `${Config.siteUrl}/${currentLanguage}/${urlType}/${selectedContent._id}`,
            };
      await Share.share(shareData);
    } catch (error: any) {
      alert(error.message);
    }
  }, [selectedContent]);

  const navigateToFavorites = () => {
    if (theme) {
      const redirectTheme = theme;
      dispatch(
        setRedirectDispositifActionCreator({
          contentId,
          needId,
          theme: redirectTheme,
        })
      );
    }
    navigation.popToTop();
    navigation.navigate("Favoris", { screen: "FavorisScreen" });
  };

  return (
    <>
      <TabBarContainer>
        <RTLView
          style={{
            justifyContent: "center",
            paddingTop: styles.margin,
            paddingBottom: insets.bottom || styles.margin,
            paddingHorizontal: styles.margin,
          }}
        >
          <CustomButton
            accessibilityLabel={
              isContentFavorite
                ? t("content_screen.remove_button_accessibility")
                : t("content_screen.add_button_accessibility")
            }
            backgroundColor={styles.colors.white}
            defaultText={"Mes fiches"}
            i18nKey="favorites_screen.my_content"
            iconFirst={true}
            iconName={isContentFavorite ? "star" : "star-outline"}
            isSmall={true}
            isTextNotBold={true}
            notFullWidth={true}
            onPress={toggleFavorites}
            readableOverridePosY={100000}
            style={{ marginHorizontal: styles.margin, width: 120 }}
            textColor={styles.colors.black}
            textStyle={{ fontSize: styles.fonts.sizes.verySmall }}
          />
          {!noReadButton && (
            <View
              style={{
                width: 56,
                height: "100%",
                marginHorizontal: styles.margin * 3,
              }}
            >
              <ReadButton bottomInset={0} />
            </View>
          )}
          <CustomButton
            accessibilityLabel={t("content_screen.share_button_accessibility")}
            backgroundColor={styles.colors.white}
            defaultText={"Partager"}
            i18nKey="content_screen.share_button"
            iconFirst={true}
            iconName="undo-outline"
            iconStyle={{ transform: [{ scaleX: -1 }] }}
            isSmall={true}
            isTextNotBold={true}
            notFullWidth={true}
            onPress={shareContent}
            readableOverridePosY={100001}
            style={{ marginHorizontal: styles.margin, width: 120 }}
            textColor={styles.colors.black}
            textStyle={{ fontSize: styles.fonts.sizes.verySmall }}
          />
        </RTLView>
      </TabBarContainer>

      {favoriteToast !== "" && (
        <Toast
          icon={favoriteToast === "added" ? "star-outline" : "trash-2-outline"}
          onClose={() => setFavoriteToast("")}
        >
          {favoriteToast === "removed" ? (
            <ToastText>
              {t(
                "content_screen.favorite_deleted",
                "Fiche supprimée de tes favoris"
              )}
            </ToastText>
          ) : (
            <View>
              <ToastText>
                <Trans i18nKey="content_screen.favorite_added">
                  Ajouté à
                  <ToastTextBold
                    onPress={navigateToFavorites}
                    style={{
                      textDecorationLine: "underline",
                      textDecorationColor: styles.colors.white,
                      marginHorizontal: styles.margin,
                    }}
                    accessibilityRole="button"
                  >
                    Mes fiches
                  </ToastTextBold>
                </Trans>
              </ToastText>
            </View>
          )}
        </Toast>
      )}
    </>
  );
};
