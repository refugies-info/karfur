import { StackScreenProps } from "@react-navigation/stack";
import { ContentForApp, Languages } from "@refugies-info/api-types";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { HeaderContentProps, Page } from "~/components";
import { ContentSummary } from "~/components/Contents/ContentSummary";
import { HeaderContentContentsScreen } from "~/components/layout/Header/HeaderContentContentsScreen";
import { TextDSFR_XL } from "~/components/StyledText";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { registerBackButton } from "~/libs/backButton";
import { defaultColors } from "~/libs/getThemeTag";
import { contentsSelector } from "~/services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { LoadingStatusKey } from "~/services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/redux/LoadingStatus/loadingStatus.selectors";
import { needNameSelector } from "~/services/redux/Needs/needs.selectors";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { ObjectId } from "~/types/interface";
import { ExplorerParamList } from "~/types/navigation";
import { addNeedView } from "~/utils/API";

const SectionHeaderText = styled(TextDSFR_XL)<{ color: string }>`
  color: ${({ color }) => color};
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
  const dispositifs = contents.filter((content) => content && content.typeContenu === "dispositif");

  const demarches = contents.filter((content) => content && content.typeContenu === "demarche");

  return sortByNbVues(demarches).concat(sortByNbVues(dispositifs));
};

const getTranslatedContents = (contents: ContentForApp[], currentLanguage: Languages | null) => {
  if (!currentLanguage || currentLanguage === "fr") return { translatedContents: contents, nonTranslatedContents: [] };
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

const getContentsToDisplay = (contentsId: ObjectId[], contents: ContentForApp[]) => {
  if (!contentsId) return [];
  let result: ContentForApp[] = [];

  contentsId.forEach((contentId: ObjectId) => {
    const contentWithInfosArray = contents.filter((content) => content._id === contentId);
    if (contentWithInfosArray.length > 0) {
      result.push(contentWithInfosArray[0]);
      return;
    }
    return;
  });
  return result;
};

export const ContentsScreen = ({ navigation, route }: StackScreenProps<ExplorerParamList, "ContentsScreen">) => {
  const { theme, needId, backScreen } = route.params;
  const { t } = useTranslationWithRTL();

  useEffect(() => {
    addNeedView(needId);
  }, []);
  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);

  // Loading
  const isLoadingContents = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS));
  const isLoadingNeeds = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  const isLoading = useMemo(() => isLoadingContents || isLoadingNeeds, [isLoadingContents, isLoadingNeeds]);

  // Content
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = useSelector(contentsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  const content = useMemo(() => {
    const contentsId = groupedContents[needId];
    const contentsToDisplay = getContentsToDisplay(contentsId, contents);

    const { translatedContents, nonTranslatedContents } = getTranslatedContents(
      contentsToDisplay,
      currentLanguageI18nCode,
    );

    const allContent: (ContentForApp | string)[] = sortContents(translatedContents);

    if (nonTranslatedContents.length > 0) {
      allContent.push("header", ...sortContents(nonTranslatedContents));
    }

    return allContent;
  }, [groupedContents, contents, needId, currentLanguageI18nCode]);

  const needName = useSelector(needNameSelector(needId, currentLanguageI18nCode));

  // Back button
  useEffect(() => registerBackButton(backScreen, navigation), []);

  const HeaderContent = useMemo(() => {
    const component: React.FC<HeaderContentProps> = (props) => (
      <HeaderContentContentsScreen needName={needName} {...props} />
    );
    component.displayName;
    return component;
  }, [needName]);

  return (
    <Page
      backScreen={backScreen}
      loading={isLoading}
      headerTitle={needName}
      HeaderContent={HeaderContent}
      headerBackgroundColor={colors.color30}
      flatList={{
        data: content,
        renderItem: ({ item }) =>
          item === "header" ? (
            <SectionHeaderText color={colors.color100}>
              {t("contents_screen.non_translated_content", "Fiches non traduites")}
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
