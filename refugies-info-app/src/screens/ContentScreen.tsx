import * as React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";
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

const ContentContainer = styled.View`
  padding: 24px;
`;

const TitlesContainer = styled.View`
  background-color: ${theme.colors.culture40};
`;

const HeaderText = styled(TextBigBold)`
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin * 2}px;
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

export const ContentScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const [accordionExpanded, setAccordionExpanded] = React.useState("");

  const { t, isRTL } = useTranslationWithRTL();

  const dispatch = useDispatch();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  React.useEffect(() => {
    // const id = "606eb3baf1ab0700152063ba";
    const id = "5dd55ea09c2d3400163bc00a";
    if (id && selectedLanguage) {
      dispatch(
        fetchSelectedContentActionCreator({
          contentId: id,
          locale: selectedLanguage,
        })
      );
    }
  }, [selectedLanguage]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));

  if (!selectedContent) {
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

  const toggleAccordion = (index: string) => {
    if (index === accordionExpanded) return setAccordionExpanded("");
    setAccordionExpanded(index);
    return;
  };

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
                  <HeaderText key={header}>
                    {t("Content." + header, header)}
                  </HeaderText>
                  <ContentFromHtml
                    htmlContent={selectedContent.contenu[index].content}
                  />
                </>
              );
            }
            if (index === 1) {
              return (
                <>
                  <HeaderText key={header}>
                    {t("Content." + header, header)}
                  </HeaderText>
                </>
              );
            }

            return (
              <>
                <HeaderText key={header}>
                  {t("Content." + header, header)}
                </HeaderText>
                {selectedContent &&
                  selectedContent.contenu[index] &&
                  selectedContent.contenu[index].children &&
                  selectedContent.contenu[index].children.map(
                    (child, indexChild) => {
                      if (child.type === "accordion") {
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
