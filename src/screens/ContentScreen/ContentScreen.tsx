import * as React from "react";
import styled from "styled-components/native";
import {
  View,
  Modal,
  Share,
  Platform,
  TouchableOpacity,
  PixelRatio,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-eva-icons";
import * as Linking from "expo-linking";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import {
  ContentType,
  Languages,
  Poi,
  ViewsType,
} from "@refugies-info/api-types";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

import { ExplorerParamList, BottomTabParamList } from "../../../types";
import { styles } from "../../theme";
import Config from "../../libs/getEnvironment";
import { MapGoogle } from "../../types/interface";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { fetchSelectedContentActionCreator } from "../../services/redux/SelectedContent/selectedContent.actions";
import { setRedirectDispositifActionCreator } from "../../services/redux/User/user.actions";
import { selectedContentSelector } from "../../services/redux/SelectedContent/selectedContent.selectors";

import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
  isFavorite,
  userFavorites,
} from "../../services/redux/User/user.selectors";
import {
  addUserFavoriteActionCreator,
  removeUserFavoriteActionCreator,
  saveUserHasNewFavoritesActionCreator,
} from "../../services/redux/User/user.actions";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { themeSelector } from "../../services/redux/Themes/themes.selectors";
import { SmallButton } from "../../components/SmallButton";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { updateNbVuesOrFavoritesOnContent } from "../../utils/API";
import { registerBackButton } from "../../libs/backButton";

import { defaultColors } from "../../libs/getThemeTag";
import { resetReadingList } from "../../services/redux/VoiceOver/voiceOver.actions";
import { useVoiceover } from "../../hooks/useVoiceover";
import { readingListLengthSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { withProps } from "../../utils";
import {
  Columns,
  CustomButton,
  ErrorScreen,
  FixSafeAreaView,
  HeaderContentContentScreen,
  HeaderContentProps,
  InfocardsSection,
  Map,
  MiniMap,
  Page,
  ReadableText,
  ReadButton,
  RTLView,
  Spacer,
  TextBigBold,
  TextSmallBold,
  TextSmallNormal,
  Toast,
} from "../../components";
import PageSkeleton from "../SearchTab/ContentScreen/PageSkeleton";
import Section from "./Section";

const HeaderText = styled(TextBigBold)`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  flex-shrink: 1;
`;

const LastUpdateDateContainer = styled(Columns)`
  margin-top: ${({ theme }) => theme.margin * 4}px;
  margin-bottom: ${({ theme }) =>
    theme.margin * 2 * PixelRatio.getFontScale()}px;
`;

const LastUpdateDate = styled(TextSmallNormal)`
  color: ${({ theme }) => theme.colors.green};
`;

const LastUpdateText = styled(TextSmallNormal)`
  color: ${({ theme }) => theme.colors.darkGrey};
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 4 : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : 4)}px;
`;

const FakeMapButton = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.white};
  justify-content: center;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.radius * 3}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  width: auto;
  height: 56px;
  padding-horizontal: ${({ theme }) => theme.radius * 3}px;
`;
const FakeMapButtonText = styled(TextSmallBold)`
  margin-left: ${({ theme }) => (!theme.i18n.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
`;
const ModalContainer = withProps(() => {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top,
  };
})(styled.View<{ paddingTop: number }>`
  display: flex;
  position: absolute;
  width: 100%;
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  padding-top: ${({ paddingTop }) => paddingTop}px;
  z-index: 2;
  flex-direction: row;
  justify-content: space-between;
`);
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

type ContentScreenType = CompositeScreenProps<
  //@ts-ignore
  StackScreenProps<ExplorerParamList, "ContentScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

const CONTENT_STRUCTURES: Record<
  ContentType,
  ("what" | "how" | "why" | "next")[]
> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const ContentScreen = ({ navigation, route }: ContentScreenType) => {
  const { contentId, needId, backScreen } = route.params;
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  const { t, isRTL } = useTranslationWithRTL();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT)
  );

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);

  const [mapModalVisible, setMapModalVisible] = React.useState(false);

  // Voiceover
  const scrollview = React.useRef<ScrollView | null>(null);
  const offset = 250;
  const { saveList } = useVoiceover(scrollview, offset);

  // Load content
  const fetchContent = (contentId: string, selectedLanguage: Languages) => {
    dispatch(resetReadingList());
    dispatch(
      fetchSelectedContentActionCreator({
        contentId,
        locale: selectedLanguage,
      })
    );
  };

  React.useEffect(() => {
    if (contentId && selectedLanguage) {
      fetchContent(contentId, selectedLanguage); // fetch in any case, to reset if needed
    }
  }, [selectedLanguage]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));
  const theme = useSelector(
    themeSelector(
      selectedContent?.theme?.toString() || route.params.theme?._id.toString()
    )
  );
  const readingListLength = useSelector(readingListLengthSelector);
  React.useEffect(() => {
    if (selectedContent) {
      if (readingListLength === undefined) {
        // new reading list if content is just loaded
        saveList();
      }
      updateNbVuesOrFavoritesOnContent(
        selectedContent._id.toString(),
        ViewsType.MOBILE
      );
    }
  }, [selectedContent]);

  const refetchContent = () => {
    if (contentId && selectedLanguage) {
      return dispatch(
        fetchSelectedContentActionCreator({
          contentId: contentId,
          locale: selectedLanguage,
        })
      );
    }
    return;
  };

  // Favorites
  const favorites = useSelector(userFavorites);
  const [favoriteToast, setFavoriteToast] = React.useState("");
  const isContentFavorite = useSelector(isFavorite(contentId));
  const toggleFavorites = () => {
    if (isContentFavorite) {
      dispatch(removeUserFavoriteActionCreator(contentId));
      setFavoriteToast("removed");
    } else {
      if (favorites.length === 0) {
        dispatch(saveUserHasNewFavoritesActionCreator());
      }
      dispatch(addUserFavoriteActionCreator(contentId));
      setFavoriteToast("added");
      if (selectedContent) {
        updateNbVuesOrFavoritesOnContent(
          selectedContent._id.toString(),
          ViewsType.FAVORITE
        );
      }
      logEventInFirebase(FirebaseEvent.ADD_FAVORITE, {
        contentId: selectedContent?._id || "unknown",
      });
    }
  };

  const sponsor = selectedContent?.mainSponsor;

  const HeaderContent = React.useMemo(
    () =>
      withProps({
        content: selectedContent,
        sponsor,
        theme,
      })(HeaderContentContentScreen) as React.ComponentType<HeaderContentProps>,
    [selectedContent, sponsor, theme]
  );

  if (isLoading)
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent?.titreInformatif}
        title={selectedContent?.titreInformatif}
        loading
        Skeleton={PageSkeleton}
      >
        <ActivityIndicator />
      </Page>
    );

  if (!selectedContent || !currentLanguage || !theme) {
    return (
      <Page backScreen={backScreen}>
        <ErrorScreen
          onButtonClick={refetchContent}
          buttonText={t("content_screen.start_again_button", "Recommencer")}
          text={t(
            "content_screen.error",
            "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard."
          )}
          buttonIcon="refresh-outline"
        />
      </Page>
    );
  }

  const colors = theme?.colors || defaultColors;

  const map: MapGoogle = {
    markers: selectedContent.map.map((poi: Poi, index) => ({
      address: poi.address,
      email: poi.email,
      latitude: poi.lat,
      longitude: poi.lng,
      nom: poi.title,
      telephone: poi.phone,
      vicinity: poi.city,
      description: poi.description,
      place_id: index.toString(),
    })),
  };

  const toggleMap = () => {
    logEventInFirebase(FirebaseEvent.CLIC_SEE_MAP, {
      contentId: selectedContent._id,
    });
    setMapModalVisible(!mapModalVisible);
  };

  // const handleClick = () => {
  //   logEventInFirebase(FirebaseEvent.CLIC_SEE_WEBSITE, {
  //     contentId: selectedContent._id,
  //   });
  //   const url = !selectedContent.externalLink.includes("https://")
  //     ? "https://" + selectedContent.externalLink
  //     : selectedContent.externalLink;
  //   Linking.canOpenURL(url).then((supported) => {
  //     if (supported) {
  //       Linking.openURL(url);
  //     }
  //   });
  // };

  const formattedLastModifDate = selectedContent.lastModificationDate
    ? moment(selectedContent.lastModificationDate).locale("fr")
    : null;

  // SHARE
  const shareContent = async () => {
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
  };

  const navigateToFavorites = () => {
    const redirectTheme = theme;
    dispatch(
      setRedirectDispositifActionCreator({
        contentId,
        needId,
        theme: redirectTheme,
      })
    );
    navigation.popToTop();
    navigation.navigate("Favoris", { screen: "FavorisScreen" });
  };

  const noReadButton = ["ps", "fa", "ti"].includes(currentLanguage || "fr");

  return (
    <>
      <Page
        backScreen={backScreen}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent.titreInformatif}
        loading={isLoading}
        Skeleton={PageSkeleton}
        HeaderContent={HeaderContent}
      >
        <Spacer height={20} />

        <Section
          key="what"
          sectionKey="what"
          contentType={selectedContent.typeContenu}
        />

        <InfocardsSection
          key="infocards"
          content={selectedContent.metadatas}
          color={colors.color100}
          typeContenu={selectedContent.typeContenu}
        />

        {CONTENT_STRUCTURES[selectedContent.typeContenu].map((section, i) => (
          <Section
            key={i}
            sectionKey={section}
            contentType={selectedContent.typeContenu}
          />
        ))}

        {/* FIXME {!!selectedContent.externalLink && (
          <View
            style={{
              marginTop: styles.margin,
              marginBottom: styles.margin * 2,
            }}
          >
            <CustomButton
              textColor={styles.colors.white}
              i18nKey="content_screen.go_website_button"
              onPress={handleClick}
              defaultText="Voir le site"
              backgroundColor={colors.color100}
              iconName="external-link-outline"
              accessibilityLabel={t("content_screen.go_website_accessibility")}
            />
          </View>
        )} */}

        {!!map && map.markers.length > 0 && (
          <>
            <HeaderText key={1} color={colors.color100}>
              <ReadableText>
                {t("content_screen.where", "Trouver un interlocuteur")}
              </ReadableText>
            </HeaderText>
            <MiniMap map={map} markersColor={colors.color100}>
              <TouchableOpacity
                onPress={toggleMap}
                accessibilityLabel={t("content_screen.see_map_button")}
                testID="test-button-map"
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FakeMapButton>
                  <Icon
                    name="eye-outline"
                    width={24}
                    height={24}
                    fill={styles.colors.black}
                  />
                  <FakeMapButtonText isRTL={isRTL}>
                    {t("content_screen.see_map_button", "Voir la carte")}
                  </FakeMapButtonText>
                </FakeMapButton>
              </TouchableOpacity>
            </MiniMap>
          </>
        )}

        {formattedLastModifDate && (
          <>
            <Spacer height={20} />
            <LastUpdateDateContainer RTLBehaviour layout="1">
              <LastUpdateText>
                {t("content_screen.last_update", "Dernière mise à jour :")}
              </LastUpdateText>
              <LastUpdateDate>
                {formattedLastModifDate.format("ll")}
              </LastUpdateDate>
            </LastUpdateDateContainer>
          </>
        )}
        <Spacer height={84} />
      </Page>

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
      <Modal visible={mapModalVisible} animationType="slide">
        <FixSafeAreaView>
          <ModalContainer>
            <SmallButton
              iconName="arrow-back-outline"
              onPress={toggleMap}
              label={t("content_screen.back_content_accessibility")}
            />
            <SmallButton
              iconName="close-outline"
              onPress={toggleMap}
              label={t("content_screen.close_map_accessibility")}
            />
          </ModalContainer>
        </FixSafeAreaView>
        <Map map={map} markersColor={colors.color100} />
      </Modal>
    </>
  );
};

export default ContentScreen;
