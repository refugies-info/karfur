import { StackScreenProps } from "@react-navigation/stack";
import { GetNeedResponse, NeedTranslation } from "@refugies-info/api-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { HeaderContentProps, Page } from "~/components";
import { ErrorScreen } from "~/components/ErrorScreen";
import HeaderContentTitle from "~/components/layout/Header/HeaderContentTitle";
import { NeedsSummary } from "~/components/Needs/NeedsSummary";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { registerBackButton } from "~/libs/backButton";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { LoadingStatusKey } from "~/services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/redux/LoadingStatus/loadingStatus.selectors";
import { needsSelector } from "~/services/redux/Needs/needs.selectors";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { ExplorerParamList } from "~/types/navigation";

const computeNeedsToDisplay = (
  allNeeds: GetNeedResponse[],
  groupedContents: Record<string, string[]>,
  themeId: string,
): GetNeedResponse[] => {
  const filteredNeeds = allNeeds.filter((need) => {
    if (
      need.theme._id === themeId &&
      groupedContents[need._id.toString()] &&
      groupedContents[need._id.toString()].length > 0
    )
      return true;
    return false;
  });

  return filteredNeeds
    .map((need) => {
      return {
        ...need,
        nbContents: groupedContents[need._id.toString()].length,
      };
    })
    .sort((a, b) => {
      // if no position, sort as before
      if (a.position === undefined || b.position === undefined) {
        if (a.nbContents > b.nbContents) return -1;
        return 1;
      }
      // else, sort with position
      if (a.position > b.position) return 1;
      return -1;
    });
};
export const NeedsScreen = ({ navigation, route }: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const { theme, backScreen } = route.params;
  const { t } = useTranslationWithRTL();

  // Loading
  const isLoadingContents = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS));
  const isLoadingNeeds = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  const isLoading = useMemo(() => isLoadingContents || isLoadingNeeds, [isLoadingContents, isLoadingNeeds]);

  // Content
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const allNeeds = useSelector(needsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  const needsWithText = useMemo(() => {
    const needsToDisplay = computeNeedsToDisplay(allNeeds, groupedContents, theme._id.toString());

    return needsToDisplay.map((need: GetNeedResponse) => {
      const needTranslation = need[currentLanguageI18nCode as keyof GetNeedResponse] as NeedTranslation;
      const needText = currentLanguageI18nCode && needTranslation?.text ? needTranslation.text : need.fr.text;
      const needSubtitle = currentLanguageI18nCode && needTranslation?.subtitle ? needTranslation.subtitle : undefined;
      return { ...need, needText, needSubtitle };
    });
  }, [allNeeds, groupedContents, theme._id, currentLanguageI18nCode]);

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);

  const Component: React.FC<HeaderContentProps> = (props) => (
    <HeaderContentTitle title={theme.name[currentLanguageI18nCode || "fr"]} titleIcon={theme.icon} {...props} />
  );
  if (needsWithText.length === 0 && !isLoading) {
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundColor={theme.colors.color100}
        headerTitle={theme.name[currentLanguageI18nCode || "fr"]}
        HeaderContent={Component}
        loading={false}
      >
        <ErrorScreen
          buttonText={t("tab_bar.explorer")}
          text={t("needs_screen.no_result", "Nous sommes désolés, nous n'avons pas de fiche ici")}
          onButtonClick={navigation.goBack}
          buttonIcon="compass-outline"
        />
      </Page>
    );
  }

  return (
    <Page
      backScreen={backScreen}
      headerBackgroundColor={theme.colors.color100}
      headerTitle={theme.name[currentLanguageI18nCode || "fr"]}
      HeaderContent={Component}
      loading={isLoading}
      flatList={{
        data: needsWithText,
        renderItem: ({ item }) => (
          <NeedsSummary
            id={item._id.toString()}
            image={item.image || item.theme.appImage}
            key={item._id.toString()}
            needSubtitle={item.needSubtitle}
            needText={item.needText}
            needTextFr={item.fr.text}
            style={{
              marginBottom: styles.margin * 3,
              marginHorizontal: styles.margin * 3,
            }}
            theme={theme}
          />
        ),
        keyExtractor: (item) => item._id.toString(),
      }}
    ></Page>
  );
};
