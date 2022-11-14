import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import useAsync from "react-use/lib/useAsync";

import {
  currentI18nCodeSelector,
  userLocationSelector,
} from "../../../services/redux/User/user.selectors";
import { SimplifiedContent } from "../../../types/interface";
import { getContentsForApp } from "../../../utils/API";
import { ContentSummary } from "../../../components/Contents/ContentSummary";
import { Page, Rows, SkeletonListPage } from "../../../components";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabParamList, ExplorerParamList } from "../../../../types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ErrorScreen } from "../../../components/ErrorScreen";
import { nbContentsSelector } from "../../../services/redux/Contents/contents.selectors";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

export interface PageProps {
  children: ReactNode;
  title: string;
}

const useNearMeCards = () => {
  const locale = useSelector(currentI18nCodeSelector);
  const { department } = useSelector(userLocationSelector);
  const {
    loading,
    error,
    value: nearMeCards,
  } = useAsync(
    () =>
      getContentsForApp({
        locale: locale?.toString() || "fr",
        department: department || "",
        strictLocation: true,
      })
        .then((response: any) => {
          return response.data?.data || response.data?.dataFr;
        })
        .then((data: any) => {
          if (!data) {
            throw new Error("Empty response from API");
          }
          return data as SimplifiedContent[];
        }) as Promise<SimplifiedContent[]>,
    [locale]
  );

  return { loading, error, nearMeCards };
};

type NearMeCardsScreenProps = CompositeScreenProps<
  StackScreenProps<ExplorerParamList, "NearMeCardsScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

const NearMeCardsScreen = ({ navigation }: NearMeCardsScreenProps) => {
  const { t } = useTranslationWithRTL();
  const { nbLocalizedContent } = useSelector(nbContentsSelector);
  const { city } = useSelector(userLocationSelector);
  const { loading, error, nearMeCards = [] } = useNearMeCards();

  if (loading)
    return (
      <Page>
        <SkeletonListPage />
      </Page>
    );
  if (error) return <ErrorScreen text={error.message} />;

  return (
    <Page
      title={
        t("explorer_screen.nb_content", {
          nbContent: nbLocalizedContent,
        }) +
        " " +
        t("explorer_screen.city_content", {
          city: city,
        })
      }
    >
      <Rows>
        {nearMeCards.map((content: SimplifiedContent) => (
          <ContentSummary
            backScreen="Search"
            contentId={content._id}
            key={content._id}
            navigation={navigation}
            sponsorUrl={content.sponsorUrl}
            theme={content.theme}
            titreInfo={content.titreInformatif}
            titreMarque={content.titreMarque}
            typeContenu={content.typeContenu}
          />
        ))}
      </Rows>
    </Page>
  );
};

export default NearMeCardsScreen;
