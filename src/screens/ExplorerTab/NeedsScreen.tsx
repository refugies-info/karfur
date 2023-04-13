import React, { ComponentType } from "react";
import { styles } from "../../theme";
import { ExplorerParamList } from "../../../types";
import { useSelector } from "react-redux";

import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { needsSelector } from "../../services/redux/Needs/needs.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ErrorScreen } from "../../components/ErrorScreen";
import { NeedsSummary } from "../../components/Needs/NeedsSummary";
import { registerBackButton } from "../../libs/backButton";
import { Page, SkeletonListPage } from "../../components";
import { withProps } from "../../utils";
import HeaderContentTitle from "../../components/layout/Header/HeaderContentTitle";
import { HeaderContentProps } from "../../components/layout/Header/HeaderContentProps";
import { GetNeedResponse, NeedTranslation } from "@refugies-info/api-types";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";

const computeNeedsToDisplay = (
  allNeeds: GetNeedResponse[],
  groupedContents: Record<string, string[]>,
  themeId: string
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
export const NeedsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const { theme, backScreen } = route.params;

  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  const { t } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const allNeeds = useSelector(needsSelector);
  const groupedContents = useSelector(groupedContentsSelector);
  const needsToDisplay = computeNeedsToDisplay(
    allNeeds,
    groupedContents,
    theme._id.toString()
  );
  // const needsToDisplay = allNeeds.filter(
  //   (need) => need.theme._id === theme._id
  // );

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);

  if (isLoading) {
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundColor={theme.colors.color100}
        headerTitle={theme.name[currentLanguageI18nCode || "fr"]}
        HeaderContent={
          withProps({
            title: theme.name[currentLanguageI18nCode || "fr"],
            titleIcon: theme.icon,
          })(HeaderContentTitle) as ComponentType<HeaderContentProps>
        }
      >
        <SkeletonListPage />
      </Page>
    );
  }

  if (needsToDisplay.length === 0) {
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundColor={theme.colors.color100}
        headerTitle={theme.name[currentLanguageI18nCode || "fr"]}
        HeaderContent={
          withProps({
            title: theme.name[currentLanguageI18nCode || "fr"],
            titleIcon: theme.icon,
          })(HeaderContentTitle) as ComponentType<HeaderContentProps>
        }
      >
        <ErrorScreen
          buttonText={t("tab_bar.explorer")}
          text={t(
            "needs_screen.no_result",
            "Nous sommes désolés, nous n'avons pas de fiche ici"
          )}
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
      HeaderContent={
        withProps({
          title: theme.name[currentLanguageI18nCode || "fr"],
          titleIcon: theme.icon,
        })(HeaderContentTitle) as ComponentType<HeaderContentProps>
      }
    >
      {needsToDisplay.map((need: GetNeedResponse) => {
        const needText =
          currentLanguageI18nCode &&
          (
            need[
              currentLanguageI18nCode as keyof GetNeedResponse
            ] as NeedTranslation
          )?.text
            ? (
                need[
                  currentLanguageI18nCode as keyof GetNeedResponse
                ] as NeedTranslation
              ).text
            : need.fr.text;
        const needSubtitle =
          currentLanguageI18nCode &&
          (
            need[
              currentLanguageI18nCode as keyof GetNeedResponse
            ] as NeedTranslation
          )?.subtitle
            ? (
                need[
                  currentLanguageI18nCode as keyof GetNeedResponse
                ] as NeedTranslation
              ).subtitle
            : undefined;

        return (
          <NeedsSummary
            id={need._id.toString()}
            image={need.image || need.theme.appImage}
            key={need._id.toString()}
            needSubtitle={needSubtitle}
            needText={needText}
            needTextFr={need.fr.text}
            style={{ marginBottom: styles.margin * 3 }}
            theme={theme}
          />
        );
      })}
    </Page>
  );
};
