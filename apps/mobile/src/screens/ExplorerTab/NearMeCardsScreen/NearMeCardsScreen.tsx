import * as React from "react";
import { useSelector } from "react-redux";
import useAsync from "react-use/lib/useAsync";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { ContentForApp, GetContentsForAppResponse } from "@refugies-info/api-types";
import { Page, Rows } from "~/components";
import { ContentSummary } from "~/components/Contents/ContentSummary";
import { ErrorScreen } from "~/components/ErrorScreen";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { nbContentsSelector } from "~/services/redux/Contents/contents.selectors";
import {
  currentI18nCodeSelector,
  userAgeSelector,
  userFrenchLevelSelector,
  userLocationSelector,
} from "~/services/redux/User/user.selectors";
import { BottomTabParamList, ExplorerParamList } from "~/types/navigation";
import { getContentsForApp } from "~/utils/API";

export interface PageProps {
  children: React.ReactNode;
  title: string;
}

const useNearMeCards = () => {
  const locale = useSelector(currentI18nCodeSelector);
  const { department } = useSelector(userLocationSelector);
  const age = useSelector(userAgeSelector);
  const frenchLevel = useSelector(userFrenchLevelSelector);
  const {
    loading,
    error,
    value: nearMeCards,
  } = useAsync(
    () =>
      getContentsForApp({
        locale: locale || "fr",
        county: department || "",
        age: age === null ? undefined : age,
        frenchLevel: frenchLevel === null ? undefined : frenchLevel,
        strictLocation: true,
      })
        .then((response: GetContentsForAppResponse) => response.data || response.dataFr)
        .then((data) => {
          if (!data) {
            throw new Error("Empty response from API");
          }
          return data;
        }) as Promise<ContentForApp[]>,
    [locale],
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

  if (error) return <ErrorScreen text={error.message} />;

  return (
    <Page
      loading={loading}
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
        {nearMeCards.map((content: ContentForApp) => (
          <ContentSummary backScreen="Search" content={content} key={content._id} />
        ))}
      </Rows>
    </Page>
  );
};

export default NearMeCardsScreen;
