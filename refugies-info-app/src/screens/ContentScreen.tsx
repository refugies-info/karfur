import * as React from "react";
import styled from "styled-components/native";
import {
  useWindowDimensions,
  View,
  Image,
  Linking,
  StyleSheet,
  Animated,
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
import {
  TextBigBold,
  TextSmallNormal,
  TextSmallBold,
  TextNormalBold,
} from "../components/StyledText";
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
import { RTLView, RTLTouchableOpacity } from "../components/BasicComponents";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import ErrorImage from "../theme/images/error.png";
import { Icon } from "react-native-eva-icons";
import { InfocardsSection } from "../components/Content/InfocardsSection";
import { Map } from "../components/Content/Map";
import { AccordionAnimated } from "../components/Content/AccordionAnimated";

const getHeaderImageHeight = (nbLines: number) => {
  if (nbLines < 3) {
    return 280;
  }
  return 280 + 40 * (nbLines - 2);
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
const SponsorImageContainer = styled.View`
  width: ${(props: { width: number }) => props.width}px;
  height: 100px;
  background-color: ${theme.colors.lightGrey};
  z-index: 2;
  margin-top: -50px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 3}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 3 : 0}px;

  border-radius: ${theme.radius * 2}px;
  padding: 8px;
  display: flex;
  margin-bottom: ${theme.margin}px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
`;

const FixedContainerForHeader = styled.View`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
`;

const StructureImageContainer = styled.View`
  background-color: ${theme.colors.white};
  display: flex;
  flex: 1;
  justify-content: center;
  border-radius: 8px;
`;

const StructureNameContainer = styled(StructureImageContainer)`
  padding: 4px;
`;

const StructureNameText = styled(TextSmallNormal)`
  text-align: center;
`;

const LastUpdateDateContainer = styled(RTLView)`
  margin-top: ${theme.margin}px;
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

const ErrorContainer = styled.View`
  margin-top: ${theme.margin * 7}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-horizontal: ${theme.margin * 3}px;
`;

const RestartButton = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.black};
  padding: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
`;

const MapHeaderContainer = styled(RTLView)`
  background-color: ${(props: { color: string }) => props.color};
  padding-vertical: 30px;
  padding-horizontal: ${theme.margin * 3}px;
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.margin}px;
`;

const MapHeaderText = styled(TextNormalBold)`
  color: ${theme.colors.white};
`;
const PinContainer = styled.View`
  width: 36px;
  height: 36px;
  background-color: ${theme.colors.white};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SimplifiedHeaderContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  padding-vertical: ${theme.margin}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
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

  const [accordionExpanded, setAccordionExpanded] = React.useState("");

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
  const { contentId, tagDarkColor, tagVeryLightColor, tagName } = route.params;

  const windowWidth = useWindowDimensions().width;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT)
  );

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
    outputRange: ["transparent", theme.colors.greyF7],
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
        <ErrorContainer>
          <Image
            source={ErrorImage}
            style={{ width: 240, height: 160, marginBottom: theme.margin * 4 }}
            width={240}
            height={160}
          />
          <TextBigBold style={{ marginBottom: theme.margin * 2 }}>
            {t("Content.Oups", "Oups !")}
          </TextBigBold>
          <TextSmallNormal
            style={{ textAlign: "center", marginBottom: theme.margin * 4 }}
          >
            {t(
              "Content.error",
              "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard."
            )}
          </TextSmallNormal>
          <RestartButton onPress={refetchContent}>
            <Icon
              name="refresh-outline"
              height={20}
              width={20}
              fill={theme.colors.white}
            />
            <TextSmallBold
              style={{
                color: theme.colors.white,
                marginLeft: isRTL ? 0 : theme.margin,
                marginRight: isRTL ? theme.margin : 0,
              }}
            >
              {t("Content.recommencer", "Recommencer")}
            </TextSmallBold>
          </RestartButton>
        </ErrorContainer>
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

  const toggleAccordion = (index: string) => {
    if (index === accordionExpanded) return setAccordionExpanded("");
    setAccordionExpanded(index);
    return;
  };

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
            <TextSmallNormal style={{ color: tagDarkColor }}>
              {selectedContent.titreInformatif}
            </TextSmallNormal>
          </SimplifiedHeaderContainer>
        </Animated.View>
      </FixedContainerForHeader>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.margin * 5 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {(!showSimplifiedHeader || true) && (
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

            <SponsorImageContainer
              width={sponsorPictureUrl ? 100 : 160}
              isRTL={isRTL}
            >
              {sponsorPictureUrl ? (
                <StructureImageContainer>
                  <Image
                    source={{
                      uri: sponsorPictureUrl,
                    }}
                    resizeMode={"contain"}
                    style={{
                      height: 84,
                      width: 84,
                    }}
                  />
                </StructureImageContainer>
              ) : (
                <StructureNameContainer>
                  <StructureNameText numberOfLines={3}>
                    {sponsor.nom}
                  </StructureNameText>
                </StructureNameContainer>
              )}
            </SponsorImageContainer>
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
                        const accordionIndex =
                          index.toString() + "-" + indexChild.toString();
                        const isAccordionExpanded =
                          accordionExpanded === accordionIndex;
                        return (
                          <AccordionAnimated
                            isExpanded={isAccordionExpanded}
                            title={child.title}
                            content={child.content}
                            toggleAccordion={() =>
                              toggleAccordion(accordionIndex)
                            }
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

          {!!map && map.markers.length > 0 && (
            <>
              <MapHeaderContainer color={tagDarkColor}>
                <MapHeaderText>
                  {t(
                    "Content.Trouver un interlocuteur",
                    "Trouver un interlocuteur"
                  )}
                </MapHeaderText>
                <PinContainer>
                  <Icon name="pin" width={20} height={20} fill={tagDarkColor} />
                </PinContainer>
              </MapHeaderContainer>

              <Map
                map={map}
                markersColor={tagDarkColor}
                windowWidth={windowWidth}
              />
            </>
          )}
        </View>
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
