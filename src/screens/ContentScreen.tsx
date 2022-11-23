import * as React from "react";
import styled from "styled-components/native";
import {
  useWindowDimensions,
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
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ExplorerParamList, BottomTabParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedContentActionCreator } from "../services/redux/SelectedContent/selectedContent.actions";
import { setRedirectDispositifActionCreator } from "../services/redux/User/user.actions";
import { selectedContentSelector } from "../services/redux/SelectedContent/selectedContent.selectors";
import { styles } from "../theme";
import Config from "../libs/getEnvironment";
import {
  TextBigBold,
  TextSmallNormal,
  TextSmallBold,
} from "../components/StyledText";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
  isFavorite,
  userFavorites,
} from "../services/redux/User/user.selectors";
import {
  addUserFavoriteActionCreator,
  removeUserFavoriteActionCreator,
  saveUserHasNewFavoritesActionCreator,
} from "../services/redux/User/user.actions";
import { Content, Theme } from "../types/interface";
import { ContentFromHtml } from "../components/Content/ContentFromHtml";
import { AvailableLanguageI18nCode, MapGoogle } from "../types/interface";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import { CustomButton } from "../components/CustomButton";
import { RTLView } from "../components/BasicComponents";
import { SmallButton } from "../components/SmallButton";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import { InfocardsSection } from "../components/Content/InfocardsSection";
import { Map } from "../components/Content/Map";
import { MiniMap } from "../components/Content/MiniMap";
import { AccordionAnimated } from "../components/Content/AccordionAnimated";
import { ErrorScreen } from "../components/ErrorScreen";
import { FixSafeAreaView } from "../components/FixSafeAreaView";
import { Toast } from "../components/Toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";
import { updateNbVuesOrFavoritesOnContent } from "../utils/API";
import { registerBackButton } from "../libs/backButton";
import { Trans } from "react-i18next";
import { defaultColors } from "../libs/getThemeTag";
import { ReadableText } from "../components/ReadableText";
import { resetReadingList } from "../services/redux/VoiceOver/voiceOver.actions";
import { useVoiceover } from "../hooks/useVoiceover";
import { ReadButton } from "../components/UI/ReadButton";
import { readingListLengthSelector } from "../services/redux/VoiceOver/voiceOver.selectors";
import { withProps } from "../utils";
import { Columns, Page, Spacer } from "../components";
import HeaderContentContentScreen from "../components/layout/Header/HeaderContentContentScreen";
import { HeaderContentProps } from "../components/layout/Header/HeaderContentProps";
import PageSkeleton from "./SearchTab/ContentScreen/PageSkeleton";

const HeaderText = styled(TextBigBold)`
  margin-top: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  flex-shrink: 1;
`;

const LastUpdateDateContainer = styled(Columns)`
  margin-top: ${styles.margin * 4}px;
  margin-bottom: ${styles.margin * 2 * PixelRatio.getFontScale()}px;
`;

const LastUpdateDate = styled(TextSmallNormal)`
  color: ${styles.colors.green};
`;

const LastUpdateText = styled(TextSmallNormal)`
  color: ${styles.colors.darkGrey};
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 4 : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : 4)}px;
`;

const FakeMapButton = styled(RTLView)`
  background-color: ${styles.colors.white};
  justify-content: center;
  align-items: center;
  padding-vertical: ${styles.radius * 3}px;
  border-radius: ${styles.radius * 2}px;
  width: auto;
  height: 56px;
`;
const FakeMapButtonText = styled(TextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? styles.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
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
  padding-horizontal: ${styles.margin * 2}px;
  padding-top: ${({ paddingTop }) => paddingTop}px;
  z-index: 2;
  flex-direction: row;
  justify-content: space-between;
`);
const TabBarContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${styles.colors.white};
  ${styles.shadows.xs}
  z-index: 14;
`;
const ToastText = styled(TextSmallNormal)`
  color: ${styles.colors.white};
`;
const ToastTextBold = styled(TextSmallBold)`
  color: ${styles.colors.white};
`;

const headersDispositif = ["what", "who", "why", "how_involved"];

const headersDemarche = ["what", "who", "how_to_do", "what_next"];

const computeIfContentIsTranslatedInCurrentLanguage = (
  avancement: 1 | Record<AvailableLanguageI18nCode, number>,
  currentLanguage: AvailableLanguageI18nCode
) => {
  if (currentLanguage === "fr") return false;
  if (avancement === 1) return false;
  return avancement[currentLanguage] === 1;
};

type ContentScreenType = CompositeScreenProps<
  //@ts-ignore
  StackScreenProps<ExplorerParamList, "ContentScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

export const ContentScreen = ({ navigation, route }: ContentScreenType) => {
  const { contentId, needId, backScreen } = route.params;
  const dispatch = useDispatch();

  const [theme, setTheme] = React.useState<Theme | null>(
    route.params.theme || null
  );
  const colors = theme?.colors || defaultColors;

  const insets = useSafeAreaInsets();

  const { t, isRTL } = useTranslationWithRTL();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  const windowWidth = useWindowDimensions().width;
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
  let unsubscribeConnectionListener: any;
  const fetchContent = (
    contentId: string,
    selectedLanguage: AvailableLanguageI18nCode
  ) => {
    dispatch(resetReadingList());
    dispatch(
      fetchSelectedContentActionCreator({
        contentId: contentId,
        locale: selectedLanguage,
      })
    );
  };
  const handleFindConnection = (connectionInfo: NetInfoState) => {
    if (connectionInfo.isConnected) {
      if (contentId && selectedLanguage) {
        unsubscribeConnectionListener();
        return fetchContent(contentId, selectedLanguage);
      }
    }
  };
  React.useEffect(() => {
    if (contentId && selectedLanguage) {
      NetInfo.fetch().then((connectionInfo) => {
        fetchContent(contentId, selectedLanguage); // fetch in any case, to reset if needed
        if (!connectionInfo.isConnected) {
          unsubscribeConnectionListener =
            NetInfo.addEventListener(handleFindConnection);
        }
      });
    }
  }, [selectedLanguage]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));
  const readingListLength = useSelector(readingListLengthSelector);
  React.useEffect(() => {
    if (selectedContent) {
      if (readingListLength === undefined) {
        // new reading list if content is just loaded
        saveList();
      }
      const nbVuesMobile = selectedContent.nbVuesMobile
        ? selectedContent.nbVuesMobile + 1
        : 1;
      updateNbVuesOrFavoritesOnContent({
        query: {
          id: selectedContent._id,
          nbVuesMobile,
        },
      });

      // Load colors if not available in route
      if (!route.params.theme) {
        setTheme(selectedContent.theme);
      }
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
        const nbFavoritesMobile = selectedContent.nbFavoritesMobile
          ? selectedContent.nbFavoritesMobile + 1
          : 1;
        updateNbVuesOrFavoritesOnContent({
          query: {
            id: selectedContent._id,
            nbFavoritesMobile,
          },
        });
      }
      logEventInFirebase(FirebaseEvent.ADD_FAVORITE, {
        contentId: selectedContent?._id || "unknown",
      });
    }
  };

  if (isLoading)
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundColor={colors.color100}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent?.titreInformatif}
        title={selectedContent?.titreInformatif}
        loading
        Skeleton={PageSkeleton}
      >
        <ActivityIndicator />
      </Page>
    );

  // @ts-ignore
  const map: MapGoogle =
    selectedContent &&
    selectedContent.contenu[3] &&
    selectedContent.contenu[3].children &&
    // @ts-ignore
    selectedContent.contenu[3].children.filter((child) => child.type === "map")
      .length > 0
      ? selectedContent.contenu[3].children.filter(
          (child) => child.type === "map"
        )[0]
      : null;

  if (!selectedContent || !currentLanguage) {
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

  const toggleMap = () => {
    logEventInFirebase(FirebaseEvent.CLIC_SEE_MAP, {
      contentId: selectedContent._id,
    });
    setMapModalVisible(!mapModalVisible);
  };

  const handleClick = () => {
    logEventInFirebase(FirebaseEvent.CLIC_SEE_WEBSITE, {
      contentId: selectedContent._id,
    });
    const url = !selectedContent.externalLink.includes("https://")
      ? "https://" + selectedContent.externalLink
      : selectedContent.externalLink;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };
  const isDispositif = selectedContent.typeContenu === "dispositif";

  const headers = isDispositif ? headersDispositif : headersDemarche;
  const isContentTranslatedInCurrentLanguage =
    computeIfContentIsTranslatedInCurrentLanguage(
      selectedContent.avancement,
      currentLanguage
    );

  const accordionMaxWidthWithStep = windowWidth - 2 * 24 - 4 * 16 - 24 - 32;
  const accordionMaxWidthWithoutStep = windowWidth - 2 * 24 - 3 * 16 - 24;

  const sponsor = selectedContent.mainSponsor;

  const formattedLastModifDate = selectedContent.lastModificationDate
    ? moment(selectedContent.lastModificationDate).locale("fr")
    : null;

  // SHARE
  const shareContent = async (content: Content) => {
    logEventInFirebase(FirebaseEvent.SHARE_CONTENT, {
      titreInformatif: content.titreInformatif,
      contentId: content._id,
    });

    const siteUrl = Config.siteUrl;
    let urlType: string = content.typeContenu;
    if (currentLanguage !== "fr") {
      urlType = content.typeContenu === "demarche" ? "procedure" : "program";
    }
    try {
      const shareData =
        Platform.OS === "ios"
          ? {
              message: `${content.titreInformatif}`,
              url: `${siteUrl}/${currentLanguage}/${urlType}/${content._id}`,
            }
          : {
              title: `${content.titreInformatif}`,
              message: `${siteUrl}/${currentLanguage}/${urlType}/${content._id}`,
            };
      await Share.share(shareData);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const navigateToFavorites = () => {
    const redirectTheme = theme || selectedContent.theme;
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
        headerBackgroundColor={colors.color30}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent.titreInformatif}
        loading={isLoading}
        Skeleton={PageSkeleton}
        HeaderContent={
          withProps({
            content: selectedContent,
            sponsor,
            theme,
          })(
            HeaderContentContentScreen
          ) as React.ComponentType<HeaderContentProps>
        }
      >
        <Spacer height={20} />
        {headers.map((header, index) => {
          if (
            index === 1 &&
            selectedContent.contenu[1] &&
            selectedContent.contenu[1].children
          )
            return (
              <InfocardsSection
                key={index}
                content={selectedContent.contenu[1].children.filter(
                  (element) => element.type === "card"
                )}
                color={colors.color100}
                typeContenu={selectedContent.typeContenu}
              />
            );
          if (index === 0 && selectedContent.contenu[0].content) {
            return (
              <View key={index}>
                <HeaderText color={colors.color100}>
                  <ReadableText>
                    {t("content_screen." + header, header)}
                  </ReadableText>
                </HeaderText>
                <View>
                  <ContentFromHtml
                    htmlContent={selectedContent.contenu[index].content}
                    windowWidth={windowWidth}
                  />
                </View>
              </View>
            );
          }
          if (index === 1) {
            return (
              <View key={index}>
                <HeaderText color={colors.color100}>
                  <ReadableText>
                    {t("content_screen." + header, header)}
                  </ReadableText>
                </HeaderText>
              </View>
            );
          }

          return (
            <View key={index}>
              <HeaderText color={colors.color100}>
                <ReadableText>
                  {t("content_screen." + header, header)}
                </ReadableText>
              </HeaderText>
              {selectedContent &&
                selectedContent.contenu[index] &&
                selectedContent.contenu[index].children &&
                // @ts-ignore
                selectedContent.contenu[index].children.map(
                  (child, indexChild) => {
                    if (child.type === "accordion" || child.type === "etape") {
                      // trigger event firebase when user clic first accordion of Je m'engage section
                      const shouldTriggerFirebaseEvent =
                        selectedContent.typeContenu === "dispositif" &&
                        index === 3 &&
                        indexChild === 0;
                      return (
                        <AccordionAnimated
                          title={child.title}
                          content={child.content}
                          key={indexChild}
                          stepNumber={
                            child.type === "etape" ? indexChild + 1 : null
                          }
                          width={
                            child.type === "etape"
                              ? accordionMaxWidthWithStep
                              : accordionMaxWidthWithoutStep
                          }
                          currentLanguage={currentLanguage}
                          windowWidth={windowWidth}
                          darkColor={colors.color100}
                          lightColor={colors.color30}
                          isContentTranslated={
                            isContentTranslatedInCurrentLanguage
                          }
                          shouldTriggerFirebaseEvent={
                            shouldTriggerFirebaseEvent
                          }
                          contentId={selectedContent._id}
                        />
                      );
                    }
                  }
                )}
            </View>
          );
        })}
        {!!selectedContent.externalLink && (
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
        )}

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
          <View>
            <LastUpdateDateContainer RTLBehaviour layout="1">
              <LastUpdateText>
                {t("content_screen.last_update", "Dernière mise à jour :")}
              </LastUpdateText>
              <LastUpdateDate>
                {formattedLastModifDate.format("ll")}
              </LastUpdateDate>
            </LastUpdateDateContainer>
          </View>
        )}
        <Spacer height={60} />
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
            onPress={toggleFavorites}
            iconName={isContentFavorite ? "star" : "star-outline"}
            i18nKey="favorites_screen.my_content"
            defaultText={"Mes fiches"}
            textColor={styles.colors.black}
            backgroundColor={styles.colors.white}
            notFullWidth={true}
            iconFirst={true}
            isTextNotBold={true}
            isSmall={true}
            style={{ marginHorizontal: styles.margin, width: 120 }}
            textStyle={{ fontSize: styles.fonts.sizes.verySmall }}
            accessibilityLabel={
              isContentFavorite
                ? t("content_screen.remove_button_accessibility")
                : t("content_screen.add_button_accessibility")
            }
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
            onPress={() => shareContent(selectedContent)}
            iconName="undo-outline"
            i18nKey="content_screen.share_button"
            defaultText={"Partager"}
            textColor={styles.colors.black}
            backgroundColor={styles.colors.white}
            notFullWidth={true}
            iconStyle={{ transform: [{ scaleX: -1 }] }}
            iconFirst={true}
            isTextNotBold={true}
            isSmall={true}
            style={{ marginHorizontal: styles.margin, width: 120 }}
            textStyle={{ fontSize: styles.fonts.sizes.verySmall }}
            accessibilityLabel={t("content_screen.share_button_accessibility")}
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
