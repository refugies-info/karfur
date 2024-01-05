import React, { useEffect, useMemo } from "react";
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
import { ObjectId } from "../types/interface";
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
import { ContentForApp, Languages } from "@refugies-info/api-types";

const SectionHeaderText = styled(TextBigBold)`
  color: ${(props: { color: string }) => props.color};
  margin-top: ${styles.margin * 6}px;
  margin-bottom: ${styles.margin * 3}px;
  margin-horizontal: ${styles.margin * 3}px;
`;

const sortByNbVues = (data: ContentForApp[]) =>
  data.sort((a, b) => {
    if (a && b && a.nbVues > b.nbVues) return -1;
    return 1;
  });
const sortContents = (contents: ContentForApp[]) => {
  const dispositifs = contents.filter(
    (content) => content && content.typeContenu === "dispositif"
  );

  const demarches = contents.filter(
    (content) => content && content.typeContenu === "demarche"
  );

  return sortByNbVues(demarches).concat(sortByNbVues(dispositifs));
};

const getTranslatedContents = (
  contents: ContentForApp[],
  currentLanguage: Languages | null
) => {
  if (!currentLanguage || currentLanguage === "fr")
    return { translatedContents: contents, nonTranslatedContents: [] };
  let translatedContents: ContentForApp[] = [];
  let nonTranslatedContents: ContentForApp[] = [];
  contents.forEach((content) => {
    if (!content) return;
    if (content.locale === currentLanguage) {
      translatedContents.push(content);
    } else {
      nonTranslatedContents.push(content);
    }
  });
  return { translatedContents, nonTranslatedContents };
};

const getContentsToDisplay = (
  contentsId: ObjectId[],
  contents: ContentForApp[]
) => {
  if (!contentsId) return [];
  let result: ContentForApp[] = [];

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
  const { theme, needId, backScreen } = route.params;
  const { t } = useTranslationWithRTL();

  useEffect(() => {
    addNeedView(needId);
  }, []);
  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);

  // Loading
  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = useMemo(
    () => isLoadingContents || isLoadingNeeds,
    [isLoadingContents, isLoadingNeeds]
  );

  // Content
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = useSelector(contentsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  const content = useMemo(() => {
    const contentsId = groupedContents[needId];
    const contentsToDisplay = getContentsToDisplay(contentsId, contents);

    const { translatedContents, nonTranslatedContents } = getTranslatedContents(
      contentsToDisplay,
      currentLanguageI18nCode
    );

    const allContent: (ContentForApp | string)[] =
      sortContents(translatedContents);

    if (nonTranslatedContents.length > 0) {
      allContent.push("header", ...sortContents(nonTranslatedContents));
    }

    return allContent;
  }, [groupedContents, contents, needId, currentLanguageI18nCode]);

  const needName = useSelector(
    needNameSelector(needId, currentLanguageI18nCode)
  );

  // Back button
  useEffect(() => registerBackButton(backScreen, navigation), []);

  return (
    <Page
      backScreen={backScreen}
      loading={isLoading}
      headerTitle={needName}
      HeaderContent={
        withProps({ needName })(
          HeaderContentContentsScreen
        ) as React.ComponentType<HeaderContentProps>
      }
      headerBackgroundColor={colors.color30}
      flatList={{
        data: content,
        renderItem: ({ item }) =>
          item === "header" ? (
            <SectionHeaderText color={colors.color100}>
              {t(
                "contents_screen.non_translated_content",
                "Fiches non traduites"
              )}
            </SectionHeaderText>
          ) : (
            <ContentSummary
              theme={theme}
              content={item}
              needId={needId}
              style={{
                marginBottom: styles.margin * 3,
                marginHorizontal: styles.margin * 3,
              }}
            />
          ),
        keyExtractor: (item) => (item._id || item).toString(),
      }}
    />
  );
};
