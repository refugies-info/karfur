import * as React from "react";
import styled from "styled-components/native";
import {
  useWindowDimensions,
  View,
  Linking,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedContentActionCreator } from "../services/redux/SelectedContent/selectedContent.actions";
import { selectedContentSelector } from "../services/redux/SelectedContent/selectedContent.selectors";
import { theme } from "../theme";
import { TextBigBold, TextSmallNormal } from "../components/StyledText";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
} from "../services/redux/User/user.selectors";
import { ContentFromHtml } from "../components/Content/ContentFromHtml";
import { AvailableLanguageI18nCode, MapGoogle } from "../types/interface";
import { HeaderImage } from "../components/Content/HeaderImage";
import { HeaderWithBackForWrapper } from "../components/HeaderWithLogo";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import SkeletonContent from "react-native-skeleton-content";
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
import { Portal } from "react-native-portalize";
import { ContentImage } from "../components/Content/ContentImage";

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
  background-color: ${theme.colors.white};
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  line-height: 40px;
  margin-bottom: ${theme.margin * 2}px;
  padding: ${theme.margin}px;
`;

const HeaderImageContainer = styled.View`
  width: 100%;
  height: ${(props: { height: number }) => props.height}px;
  position: absolute;
  top: 0px;
`;

const TitreMarqueText = styled(TextSmallNormal)`
  background-color: ${theme.colors.white};
  opacity: 0.9;
  line-height: 32px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  padding: ${theme.margin}px;
`;

const HeaderText = styled(TextBigBold)`
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin * 2}px;
  color: ${(props: { textColor: string }) => props.textColor};
  flex-shrink: 1;
  margin-horizontal: ${theme.margin * 3}px;
`;

const FixedContainerForHeader = styled.View`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
`;

const LastUpdateDateContainer = styled(RTLView)`
  margin-top: ${theme.margin * 4}px;
  margin-bottom: ${theme.margin * 2}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const LastUpdateDate = styled(TextSmallNormal)`
  color: ${theme.colors.formation80};
`;

const LastUpdateText = styled(TextSmallNormal)`
  color: ${theme.colors.darkGrey};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 4 : 0)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : 4)}px;
`;

const SimplifiedHeaderContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  padding-vertical: ${theme.margin}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
`;
const ModalContainer = styled.View`
  display: flex;
  position: absolute;
  width: 100%;
  top: 0;
  padding: ${theme.margin * 2}px;
  z-index: 2;
`;

const headersDispositif = [
  "C'est quoi ?",
  "C'est pour qui ?",
  "Pourquoi c'est intéressant ?",
  "Comment je m'engage ?",
];

const headersDemarche = [
  "C'est quoi ?",
  "C'est pour qui ?",
  "Comment faire ?",
  "Et après ?",
];

const styles = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
  },

  bodyContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

const computeIfContentIsTranslatedInCurrentLanguage = (
  avancement: 1 | Record<AvailableLanguageI18nCode, number>,
  currentLanguage: AvailableLanguageI18nCode
) => {
  if (currentLanguage === "fr") return false;
  if (avancement === 1) return false;
  return avancement[currentLanguage] === 1;
};

export const ContentScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "ContentScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );
  const [nbLinesTitreInfo, setNbLinesTitreInfo] = React.useState(2);
  const [nbLinesTitreMarque, setNbLinesTitreMarque] = React.useState(1);

  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const animatedController = React.useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = React.useState(0);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const { t, isRTL } = useTranslationWithRTL();

  const dispatch = useDispatch();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);
  const {
    contentId,
    tagDarkColor,
    tagVeryLightColor,
    tagName,
    tagLightColor,
    iconName,
  } = route.params;

  const windowWidth = useWindowDimensions().width;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT)
  );

  const [mapModalVisible, setMapModalVisible] = React.useState(false);
  const toggleMap = () => {
    setMapModalVisible(!mapModalVisible);
  };

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

  const boxInterpolation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", tagLightColor],
  });

  React.useEffect(() => {
    if (contentId && selectedLanguage) {
      dispatch(
        fetchSelectedContentActionCreator({
          contentId: contentId,
          locale: selectedLanguage,
        })
      );
    }
  }, [selectedLanguage]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));

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

  if (isLoading) {
    return (
      <WrapperWithHeaderAndLanguageModal
        showSwitch={true}
        navigation={navigation}
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
          boneColor={theme.colors.grey}
          highlightColor={theme.colors.lightGrey}
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
      >
        <ErrorScreen
          onButtonClick={refetchContent}
          buttonText={t("Content.recommencer", "Recommencer")}
          text={t(
            "Content.error",
            "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard."
          )}
          buttonIcon="refresh-outline"
        />
      </WrapperWithHeaderAndLanguageModal>
    );
  }

  const handleClick = () => {
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
  const isContentTranslatedInCurrentLanguage = computeIfContentIsTranslatedInCurrentLanguage(
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

  return (
    <View>
      <FixedContainerForHeader>
        <Animated.View style={{ backgroundColor: boxInterpolation }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bodyBackground,
            { height: bodyHeight, backgroundColor: boxInterpolation },
          ]}
        >
          <SimplifiedHeaderContainer
            onLayout={(event: any) =>
              setBodySectionHeight(event.nativeEvent.layout.height)
            }
            style={styles.bodyContainer}
          >
            <TextSmallNormal style={{ color: theme.colors.white }}>
              {selectedContent.titreInformatif}
            </TextSmallNormal>
          </SimplifiedHeaderContainer>
        </Animated.View>
      </FixedContainerForHeader>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.margin * 5 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {!showSimplifiedHeader && (
          <>
            <HeaderImage tagName={tagName} height={headerImageHeight} />
            <HeaderImageContainer height={headerImageHeight}>
              <TitlesContainer width={windowWidth - 2 * 24} isRTL={isRTL}>
                <TitreInfoText
                  isRTL={isRTL}
                  onLayout={(e: any) => onLayoutTitre(e, "titreInfo")}
                >
                  {selectedContent.titreInformatif}
                </TitreInfoText>

                {!!selectedContent.titreMarque && (
                  <TitreMarqueText
                    onLayout={(e: any) => onLayoutTitre(e, "titreMarque")}
                    isRTL={isRTL}
                  >
                    {"avec " + selectedContent.titreMarque}
                  </TitreMarqueText>
                )}
              </TitlesContainer>
            </HeaderImageContainer>

            <ContentImage
              sponsorName={sponsor.nom}
              sponsorPictureUrl={sponsorPictureUrl}
              typeContenu={selectedContent.typeContenu}
              iconName={iconName}
              contentId={selectedContent._id}
            />
          </>
        )}
        <View>
          {headers.map((header, index) => {
            if (
              index === 1 &&
              selectedContent.contenu[1] &&
              selectedContent.contenu[1].children
            )
              return (
                <InfocardsSection
                  content={selectedContent.contenu[1].children.filter(
                    (element) => element.type === "card"
                  )}
                  color={tagDarkColor}
                  typeContenu={selectedContent.typeContenu}
                />
              );
            if (index === 0 && selectedContent.contenu[0].content) {
              return (
                <>
                  <HeaderText key={header} textColor={tagDarkColor}>
                    {t("Content." + header, header)}
                  </HeaderText>
                  <View style={{ marginHorizontal: theme.margin * 3 }}>
                    <ContentFromHtml
                      htmlContent={selectedContent.contenu[index].content}
                      windowWidth={windowWidth}
                    />
                  </View>
                </>
              );
            }
            if (index === 1) {
              return (
                <>
                  <HeaderText key={header} textColor={tagDarkColor}>
                    {t("Content." + header, header)}
                  </HeaderText>
                </>
              );
            }

            return (
              <>
                <HeaderText key={header} textColor={tagDarkColor}>
                  {t("Content." + header, header)}
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
                            darkColor={tagDarkColor}
                            lightColor={tagVeryLightColor}
                            isContentTranslated={
                              isContentTranslatedInCurrentLanguage
                            }
                          />
                        );
                      }
                    }
                  )}
              </>
            );
          })}
          {!!selectedContent.externalLink && (
            <View
              style={{
                marginTop: theme.margin,
                marginHorizontal: theme.margin * 3,
                marginBottom: theme.margin * 2,
              }}
            >
              <CustomButton
                textColor={theme.colors.white}
                i18nKey="Content.Voir le site"
                onPress={handleClick}
                defaultText="Voir le site"
                backgroundColor={tagDarkColor}
                iconName="external-link-outline"
              />
            </View>
          )}

          {!!map && map.markers.length > 0 && (
            <>
              <HeaderText key={1} textColor={tagDarkColor}>
                {t(
                  "Content.Trouver un interlocuteur",
                  "Trouver un interlocuteur"
                )}
              </HeaderText>
              <MiniMap map={map} markersColor={tagDarkColor}>
                <CustomButton
                  textColor={theme.colors.black}
                  i18nKey="Content.Voir la carte"
                  onPress={toggleMap}
                  defaultText="Voir la carte"
                  backgroundColor={theme.colors.white}
                  iconName="expand-outline"
                  iconFirst={true}
                  notFullWidth={true}
                />
              </MiniMap>
            </>
          )}

          {formattedLastModifDate && (
            <LastUpdateDateContainer>
              <LastUpdateText isRTL={isRTL}>
                {t("Content.last_update", "Dernière mise à jour :")}
              </LastUpdateText>
              <LastUpdateDate>
                {formattedLastModifDate.format("ll")}
              </LastUpdateDate>
            </LastUpdateDateContainer>
          )}
        </View>
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
      {/*
        TODO: Fix for https://github.com/software-mansion/react-native-gesture-handler/issues/139
        Remove when this released https://github.com/software-mansion/react-native-gesture-handler/pull/1603
       */}
      <Portal>
        <Modal visible={mapModalVisible} animationType="slide">
          <ModalContainer>
            <FixSafeAreaView
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SmallButton iconName="arrow-back-outline" onPress={toggleMap} />
              <SmallButton
                iconName="close-outline"
                onPress={toggleMap}
                reversed={true}
              />
            </FixSafeAreaView>
          </ModalContainer>
          <Map map={map} markersColor={tagDarkColor} />
        </Modal>
      </Portal>
    </View>
  );
};
