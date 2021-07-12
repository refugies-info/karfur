import * as React from "react";
import styled from "styled-components/native";
import { Text, useWindowDimensions, View, Image, Linking } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
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
import { Accordion } from "../components/Content/Accordion";
import { AvailableLanguageI18nCode } from "../types/interface";
import { HeaderImage } from "../components/Content/HeaderImage";
import { HeaderWithBackForWrapper } from "../components/HeaderWithLogo";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import SkeletonContent from "react-native-skeleton-content";
import { CustomButton } from "../components/CustomButton";
import { RTLView } from "../components/BasicComponents";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

const getHeaderImageHeight = (nbLines: number) => {
  if (nbLines < 3) {
    return 280;
  }
  return 280 + 40 * (nbLines - 2);
};
const ContentContainer = styled.View`
  padding-horizontal: 24px;
`;

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
`;
const SponsorImageContainer = styled.View`
  width: ${(props: { width: number }) => props.width}px;
  height: 100px;
  background-color: ${theme.colors.lightGrey};
  z-index: 2;
  margin-top: -50px;
  margin-left: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: ${theme.margin}px;
`;

const FixedContainerForHeader = styled.View`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
`;

const StructureNameContainer = styled.View`
  background-color: ${theme.colors.white};
  display: flex;
  flex: 1;
  justify-content: center;
  border-radius: 8px;
`;
const StructureNameText = styled(TextSmallNormal)`
  text-align: center;
`;

const LastUpdateDateContainer = styled(RTLView)`
  margin-top: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
`;

const LastUpdateDate = styled(TextSmallNormal)`
  color: ${theme.colors.formation80};
`;

const LastUpdateText = styled(TextSmallNormal)`
  color: ${theme.colors.darkGrey};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 4 : 0)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : 4)}px;
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

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const [accordionExpanded, setAccordionExpanded] = React.useState("");

  const { t, isRTL } = useTranslationWithRTL();

  const dispatch = useDispatch();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);
  const { contentId, tagDarkColor, tagVeryLightColor, tagName } = route.params;

  const windowWidth = useWindowDimensions().width;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT)
  );

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

  if (!selectedContent || !currentLanguage) {
    return (
      <WrapperWithHeaderAndLanguageModal
        showSwitch={true}
        navigation={navigation}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <Text>Back</Text>
        </TouchableOpacity>

        <ContentContainer>
          <Text>pas de contenu</Text>
        </ContentContainer>
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

  return (
    <View>
      <FixedContainerForHeader>
        <HeaderWithBackForWrapper
          onLongPressSwitchLanguage={toggleLanguageModal}
          navigation={navigation}
        />
      </FixedContainerForHeader>
      <ScrollView>
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

        <SponsorImageContainer width={sponsorPictureUrl ? 100 : 160}>
          {sponsorPictureUrl ? (
            <Image
              source={{
                uri: sponsorPictureUrl,
              }}
              resizeMode={"contain"}
              style={{
                height: 84,
                width: 84,
                backgroundColor: theme.colors.white,
                borderRadius: 8,
              }}
            />
          ) : (
            <StructureNameContainer>
              <StructureNameText numberOfLines={3}>
                {sponsor.nom}
              </StructureNameText>
            </StructureNameContainer>
          )}
        </SponsorImageContainer>
        <ContentContainer>
          {headers.map((header, index) => {
            if (index === 0 && selectedContent.contenu[0].content) {
              return (
                <>
                  <HeaderText key={header} textColor={tagDarkColor}>
                    {t("Content." + header, header)}
                  </HeaderText>
                  <ContentFromHtml
                    htmlContent={selectedContent.contenu[index].content}
                    windowWidth={windowWidth}
                  />
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
                          <Accordion
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
            <View style={{ marginTop: 8 }}>
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
        </ContentContainer>
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
