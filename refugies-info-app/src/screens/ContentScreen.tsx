import * as React from "react";
import styled from "styled-components/native";
import { Text, useWindowDimensions } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedContentActionCreator } from "../services/redux/SelectedContent/selectedContent.actions";
import { selectedContentSelector } from "../services/redux/SelectedContent/selectedContent.selectors";
import { theme } from "../theme";
import { TextNormal, TextBigBold } from "../components/StyledText";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
} from "../services/redux/User/user.selectors";
import { ContentFromHtml } from "../components/Content/ContentFromHtml";
import { Accordion } from "../components/Content/Accordion";
import { AvailableLanguageI18nCode } from "../types/interface";

const ContentContainer = styled.View`
  padding: 24px;
`;

const TitlesContainer = styled.View`
  background-color: ${theme.colors.culture40};
`;

const HeaderText = styled(TextBigBold)`
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin * 2}px;
  color: ${(props: { textColor: string }) => props.textColor};
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
  const [accordionExpanded, setAccordionExpanded] = React.useState("");

  const { t } = useTranslationWithRTL();

  const dispatch = useDispatch();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);
  const { contentId, tagDarkColor, tagVeryLightColor } = route.params;

  const windowWidth = useWindowDimensions().width;
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

  return (
    <WrapperWithHeaderAndLanguageModal
      showSwitch={true}
      navigation={navigation}
    >
      <ScrollView>
        <ContentContainer>
          <TitlesContainer>
            <TextNormal>{selectedContent.titreInformatif}</TextNormal>
            {selectedContent.titreMarque && (
              <TextNormal>{"avec " + selectedContent.titreMarque}</TextNormal>
            )}
          </TitlesContainer>

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
        </ContentContainer>
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
