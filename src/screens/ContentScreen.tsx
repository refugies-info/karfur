import * as React from "react";
import styled from "styled-components/native";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  Animated,
  Modal,
  Share,
  Platform,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  PixelRatio,
} from "react-native";
import { Icon } from "react-native-eva-icons";
import * as Linking from "expo-linking";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ExplorerParamList, BottomTabParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
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
import { HeaderImage } from "../components/Content/HeaderImage";
import { HeaderWithBackForWrapper } from "../components/HeaderWithLogo";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
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
import { ContentImage } from "../components/Content/ContentImage";
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
import { Columns, Content as DSContent } from "../components";

const getHeaderImageHeight = (nbLines: number) => {
  if (nbLines < 3) {
    return 290;
  }
  return 290 + 40 * (nbLines - 2);
};

const TitlesContainer = styled(View)`
  position: absolute;
  bottom: 0px;
  width: ${(props: { width: number }) => props.width}px;
  left: 24px;
  margin-bottom: 66px;
`;

const TitreInfoText = styled(TextBigBold)`
  opacity: 0.9;
  background-color: ${styles.colors.white};
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  line-height: 40px;
  margin-bottom: ${styles.margin * 2}px;
  padding: ${styles.margin}px;
`;

const HeaderImageContainer = styled.View`
  width: 100%;
  height: ${(props: { height: number }) => props.height}px;
  position: absolute;
  top: 0px;
`;

const TitreMarqueText = styled(TextSmallNormal)`
  background-color: ${styles.colors.white};
  opacity: 0.9;
  line-height: 32px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  padding: ${styles.margin}px;
`;

const HeaderText = styled(TextBigBold)`
  margin-top: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  color: ${(props: { textColor: string }) => props.textColor};
  flex-shrink: 1;
  margin-horizontal: ${styles.margin * 3}px;
`;

const FixedContainerForHeader = styled.View`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
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

const SimplifiedHeaderContainer = styled.View`
  padding-horizontal: ${styles.margin * 3}px;
  padding-vertical: ${styles.margin}px;
  ${styles.shadows.lg}
`;
const FakeMapButton = styled(RTLView)`
  background-color: ${styles.colors.white};
  justify-content: center;
  align-items: center;
  padding: ${styles.radius * 3}px;
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

const stylesheet = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
  },

  bodyContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: {
  layoutMeasurement: any;
  contentOffset: any;
  contentSize: any;
}) => {
  if (!layoutMeasurement) return false;
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

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

  const [isLanguageModalVisible, setLanguageModalVisible] =
    React.useState(false);
  const [nbLinesTitreInfo, setNbLinesTitreInfo] = React.useState(2);
  const [nbLinesTitreMarque, setNbLinesTitreMarque] = React.useState(1);
  const [theme, setTheme] = React.useState<Theme | null>(
    route.params.theme || null
  );
  const colors = theme?.colors || defaultColors;

  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);
  const [hasSentEventBottomReached, setHasSentEventBottomReached] =
    React.useState(false);

  const insets = useSafeAreaInsets();

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const animatedController = React.useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = React.useState(0);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

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

  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    if (displayHeader && !showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 400,
        toValue: 1,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(true);
      return;
    }

    if (!displayHeader && showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 400,
        toValue: 0,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(false);
      return;
    }
  };

  // Voiceover
  const scrollview = React.useRef<ScrollView | null>(null);
  const offset = 250;
  const { setScroll, saveList } = useVoiceover(scrollview, offset);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(
      event.nativeEvent.contentOffset.y,
      showSimplifiedHeader ? offset : 0
    );
  };

  // Header color
  const getInterpolation = (color: string) => {
    return animatedController.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", color],
    });
  };
  const [boxInterpolation, setBoxInterpolation] = React.useState(
    getInterpolation(colors.color100)
  );
  React.useEffect(() => {
    setBoxInterpolation(getInterpolation(colors.color100));
  }, [colors.color100]);

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

  const onLayoutTitre = (e: any, titre: string) => {
    const { height } = e.nativeEvent.layout;
    if (titre === "titreInfo") {
      setNbLinesTitreInfo(Math.floor(height / 40));
      return;
    }
    setNbLinesTitreMarque(Math.floor(height / 32));
    return;
  };

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

  if (isLoading) {
    return (
      <WrapperWithHeaderAndLanguageModal
        showSwitch={true}
        navigation={navigation}
        backScreen={backScreen}
      >
        <SkeletonContent
          containerStyle={{
            display: "flex",
            flex: 1,
            marginTop: 50,
            marginHorizontal: 24,
          }}
          isLoading={true}
          layout={[
            { key: "titreInfo", width: 220, height: 40, marginBottom: 16 },
            { key: "titreMarque", width: 180, height: 40, marginBottom: 52 },
            { key: "Title", width: 130, height: 35, marginBottom: 16 },
            { key: "Section1", width: "100%", height: 100 },
          ]}
          boneColor={styles.colors.grey}
          highlightColor={styles.colors.lightGrey}
        />
      </WrapperWithHeaderAndLanguageModal>
    );
  }

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
      <WrapperWithHeaderAndLanguageModal
        showSwitch={true}
        navigation={navigation}
        backScreen={backScreen}
      >
        <ErrorScreen
          onButtonClick={refetchContent}
          buttonText={t("content_screen.start_again_button", "Recommencer")}
          text={t(
            "content_screen.error",
            "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard."
          )}
          buttonIcon="refresh-outline"
        />
      </WrapperWithHeaderAndLanguageModal>
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

  const nbLinesTitle =
    nbLinesTitreInfo +
    (selectedContent.typeContenu === "dispositif" ? nbLinesTitreMarque : 0);
  const headerImageHeight = getHeaderImageHeight(nbLinesTitle);

  const sponsor = selectedContent.mainSponsor;
  const sponsorPictureUrl =
    sponsor && sponsor.picture && sponsor.picture.secure_url
      ? sponsor.picture.secure_url
      : null;

  const formattedLastModifDate = selectedContent.lastModificationDate
    ? moment(selectedContent.lastModificationDate).locale("fr")
    : null;

  const handleScroll = (event: any) => {
    if (!hasSentEventBottomReached && isCloseToBottom(event.nativeEvent)) {
      logEventInFirebase(FirebaseEvent.REACH_END_CONTENT, { contentId });
      setHasSentEventBottomReached(true);
    }

    if (event.nativeEvent.contentOffset.y > headerImageHeight * 0.7) {
      toggleSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < headerImageHeight * 0.6) {
      toggleSimplifiedHeader(false);
      return;
    }
    return;
  };

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
    <View style={{ paddingBottom: 60 }}>
      <FixedContainerForHeader>
        <Animated.View style={{ backgroundColor: boxInterpolation }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
            backScreen={backScreen}
          />
        </Animated.View>

        <Animated.View
          style={[
            stylesheet.bodyBackground,
            { height: bodyHeight, backgroundColor: boxInterpolation },
          ]}
        >
          <SimplifiedHeaderContainer
            onLayout={(event: any) =>
              setBodySectionHeight(event.nativeEvent.layout.height)
            }
            style={stylesheet.bodyContainer}
          >
            <TextSmallNormal style={{ color: styles.colors.white }}>
              {selectedContent.titreInformatif}
            </TextSmallNormal>
          </SimplifiedHeaderContainer>
        </Animated.View>
      </FixedContainerForHeader>
      <ScrollView
        ref={scrollview}
        contentContainerStyle={{
          paddingBottom: styles.margin * 5 + (insets.bottom || 0),
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ right: 1 }}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
      >
        {
          <>
            <HeaderImage theme={theme} height={headerImageHeight} />
            <HeaderImageContainer height={headerImageHeight}>
              <TitlesContainer width={windowWidth - 2 * 24}>
                <TitreInfoText
                  isRTL={isRTL}
                  onLayout={(e: any) => onLayoutTitre(e, "titreInfo")}
                >
                  <ReadableText>
                    {selectedContent.titreInformatif || ""}
                  </ReadableText>
                </TitreInfoText>

                {!!selectedContent.titreMarque && (
                  <TitreMarqueText
                    onLayout={(e: any) => onLayoutTitre(e, "titreMarque")}
                    isRTL={isRTL}
                  >
                    <ReadableText>
                      {"avec " + selectedContent.titreMarque}
                    </ReadableText>
                  </TitreMarqueText>
                )}
              </TitlesContainer>
            </HeaderImageContainer>

            <ContentImage
              sponsorName={sponsor.nom}
              sponsorPictureUrl={sponsorPictureUrl}
              typeContenu={selectedContent.typeContenu}
              icon={theme?.icon}
              contentId={selectedContent._id}
            />
          </>
        }
        <View>
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
                  <HeaderText textColor={colors.color100}>
                    <ReadableText>
                      {t("content_screen." + header, header)}
                    </ReadableText>
                  </HeaderText>
                  <View style={{ marginHorizontal: styles.margin * 3 }}>
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
                  <HeaderText textColor={colors.color100}>
                    <ReadableText>
                      {t("content_screen." + header, header)}
                    </ReadableText>
                  </HeaderText>
                </View>
              );
            }

            return (
              <View key={index}>
                <HeaderText textColor={colors.color100}>
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
                      if (
                        child.type === "accordion" ||
                        child.type === "etape"
                      ) {
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
                marginHorizontal: styles.margin * 3,
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
                accessibilityLabel={t(
                  "content_screen.go_website_accessibility"
                )}
              />
            </View>
          )}

          {!!map && map.markers.length > 0 && (
            <>
              <HeaderText key={1} textColor={colors.color100}>
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
            <DSContent>
              <LastUpdateDateContainer RTLBehaviour layout="1">
                <LastUpdateText>
                  {t("content_screen.last_update", "Dernière mise à jour :")}
                </LastUpdateText>
                <LastUpdateDate>
                  {formattedLastModifDate.format("ll")}
                </LastUpdateDate>
              </LastUpdateDateContainer>
            </DSContent>
          )}
        </View>
      </ScrollView>

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

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />

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
    </View>
  );
};
