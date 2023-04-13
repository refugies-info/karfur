import * as React from "react";
import { useSelector } from "react-redux";
import useAsync from "react-use/lib/useAsync";

import {
  currentI18nCodeSelector,
  userLocationSelector,
} from "../../../services/redux/User/user.selectors";
import { SimplifiedContent } from "../../../types/interface";
import { getContentsForApp } from "../../../utils/API";
import { ContentSummary } from "../../../components/Contents/ContentSummary";
import { Page, Rows } from "../../../components";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabParamList, ExplorerParamList } from "../../../../types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ErrorScreen } from "../../../components/ErrorScreen";
import { nbContentsSelector } from "../../../services/redux/Contents/contents.selectors";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { GetContentsForAppResponse } from "@refugies-info/api-types";

export interface PageProps {
  children: React.ReactNode;
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
        locale: locale || "fr",
        county: department || "",
        strictLocation: true,
      })
        .then(
          (response: GetContentsForAppResponse) =>
            response.data || response.dataFr
        )
        .then((data) => {
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
