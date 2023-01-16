import * as React from "react";
import { ExplorerParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { contentsSelector } from "../services/redux/Contents/contents.selectors";
import { View } from "react-native";
import { styles } from "../theme";
import { needNameSelector } from "../services/redux/Needs/needs.selectors";
import { groupedContentsSelector } from "../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import { ContentSummary } from "../components/Contents/ContentSummary";
import {
  SimplifiedContent,
  AvailableLanguageI18nCode,
  ObjectId,
} from "../types/interface";
import { TextBigBold } from "../components/StyledText";
import styled from "styled-components/native";
import { registerBackButton } from "../libs/backButton";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { defaultColors } from "../libs/getThemeTag";
import { addNeedView } from "../utils/API";
import { Page } from "../components";
import { withProps } from "../utils";
import { HeaderContentProps } from "../components/layout/Header/HeaderContentProps";
import { HeaderContentContentsScreen } from "../components/layout/Header/HeaderContentContentsScreen";

const SectionHeaderText = styled(TextBigBold)`
  color: ${(props: { color: string }) => props.color};
  margin-top: ${styles.margin * 6}px;
  margin-bottom: ${styles.margin * 3}px;
`;

const sortByNbVues = (data: SimplifiedContent[]) =>
  data.sort((a, b) => {
    if (a && b && a.nbVues > b.nbVues) return -1;
    return 1;
  });
const sortContents = (contents: SimplifiedContent[]) => {
  const dispositifs = contents.filter(
    (content) => content && content.typeContenu === "dispositif"
  );

  const demarches = contents.filter(
    (content) => content && content.typeContenu === "demarche"
  );

  return sortByNbVues(demarches).concat(sortByNbVues(dispositifs));
};

const getTranslatedContents = (
  contents: SimplifiedContent[],
  currentLanguage: AvailableLanguageI18nCode | null
) => {
  if (!currentLanguage || currentLanguage === "fr")
    return { translatedContents: contents, nonTranslatedContents: [] };
  let translatedContents: SimplifiedContent[] = [];
  let nonTranslatedContents: SimplifiedContent[] = [];
  contents.forEach((content) => {
    if (!content) return;
    if (
      content.avancement &&
      // @ts-ignore
      content.avancement[currentLanguage] &&
      // @ts-ignore
      content.avancement[currentLanguage] === 1
    ) {
      translatedContents.push(content);
      return;
    }
    nonTranslatedContents.push(content);
  });
  return { translatedContents, nonTranslatedContents };
};

const getContentsToDisplay = (
  contentsId: ObjectId[],
  contents: SimplifiedContent[]
) => {
  if (!contentsId) return [];
  let result: SimplifiedContent[] = [];

  contentsId.forEach((contentId: ObjectId) => {
    const contentWithInfosArray = contents.filter(
      (content) => content._id === contentId
    );
    if (contentWithInfosArray.length > 0) {
      result.push(contentWithInfosArray[0]);
      return;
    }
    return;
  });
  return result;
};

export const ContentsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "ContentsScreen">) => {
  const { t } = useTranslationWithRTL();

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = useSelector(contentsSelector);
  const { theme, needId, backScreen } = route.params;

  const groupedContents = useSelector(groupedContentsSelector);
  const contentsId = groupedContents[needId];
  const contentsToDisplay = getContentsToDisplay(contentsId, contents);

  const { translatedContents, nonTranslatedContents } = getTranslatedContents(
    contentsToDisplay,
    currentLanguageI18nCode
  );

  const sortedTranslatedContents = sortContents(translatedContents);
  const sortedNonTranslatedContents = sortContents(nonTranslatedContents);

  const needName = useSelector(
    needNameSelector(needId, currentLanguageI18nCode)
  );

  React.useEffect(() => {
    addNeedView({ id: needId });
  }, []);

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);
  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  const colors = theme?.colors || defaultColors;

  return (
    <Page
      backScreen={backScreen}
      loading={isLoading}
      headerTitle={needName}
      HeaderContent={
        withProps({
          needName,
        })(
          HeaderContentContentsScreen
        ) as React.ComponentType<HeaderContentProps>
      }
      headerBackgroundColor={colors.color30}
    >
      {sortedTranslatedContents.map((content) => {
        return (
          <ContentSummary
            key={content._id}
            navigation={navigation}
            theme={theme}
            contentId={content._id}
            needId={needId}
            titreInfo={content.titreInformatif}
            titreMarque={content.titreMarque}
            typeContenu={content.typeContenu}
            sponsorUrl={content.sponsorUrl}
            style={{ marginBottom: styles.margin * 3 }}
          />
        );
      })}

      {sortedNonTranslatedContents.length > 0 && (
        <View>
          <SectionHeaderText color={colors.color100}>
            {t(
              "contents_screen.non_translated_content",
              "Fiches non traduites"
            )}
          </SectionHeaderText>
          {sortedNonTranslatedContents.map((content) => {
            return (
              <ContentSummary
                key={content._id}
                navigation={navigation}
                theme={theme}
                contentId={content._id}
                needId={needId}
                titreInfo={content.titreInformatif}
                titreMarque={content.titreMarque}
                typeContenu={content.typeContenu}
                sponsorUrl={content.sponsorUrl}
                style={{ marginBottom: styles.margin * 3 }}
              />
            );
          })}
        </View>
      )}
    </Page>
  );
};
