import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { ContentType, ViewsType } from "@refugies-info/api-types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { LoadingStatusKey } from "~/services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/redux/LoadingStatus/loadingStatus.selectors";
import { fetchSelectedContentActionCreator } from "~/services/redux/SelectedContent/selectedContent.actions";
import { selectedContentSelector } from "~/services/redux/SelectedContent/selectedContent.selectors";
import { themeSelector } from "~/services/redux/Themes/themes.selectors";
import {
  currentI18nCodeSelector,
  hasUserSeenOnboardingSelector,
  initialUrlSelector,
  selectedI18nCodeSelector,
} from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { BottomTabParamList, ExplorerParamList } from "~/types/navigation";

import { registerBackButton } from "~/libs/backButton";
import { updateNbVuesOrFavoritesOnContent } from "~/utils/API";

import isEmpty from "lodash/isEmpty";
import {
  DemarcheImage,
  ErrorScreen,
  HeaderContentContentScreen,
  InfocardsSection,
  Page,
  ReadableText,
  Rows,
  RowsSpacing,
  RTLView,
  Separator,
  Spacer,
  TextDSFR_L,
  Title,
  UpButton,
} from "~/components";
import { SeparatorSpacing } from "~/components/layout/Separator/Separator";
import { defaultColors } from "~/libs/getThemeTag";
import { setInitialUrlActionCreator } from "~/services/redux/User/user.actions";
import PageSkeleton from "../SearchTab/ContentScreen/PageSkeleton";
import { ContentTabBar } from "./ContentTabBar";
import { ExternalLink } from "./ExternalLink";
import LanguageUnavailable from "./LanguageUnavailable";
import { LastModificationDate } from "./LastModificationDate";
import { LinkedThemesNeeds } from "./LinkedThemesNeeds";
import { MapMarkers } from "./MapMarkers";
import { Section } from "./Section";
import { Mercis } from "./Sections";
import { Sponsors } from "./Sponsors";

export type ContentScreenType = CompositeScreenProps<
  StackScreenProps<ExplorerParamList, "ContentScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

const CONTENT_STRUCTURES: Record<ContentType, ("what" | "how" | "why" | "next")[]> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const stylesheet = StyleSheet.create({
  page: {
    borderTopRightRadius: styles.margin,
    borderTopLeftRadius: styles.margin,
    marginTop: -styles.margin,
  },
});

const ContentScreen = ({ navigation, route }: ContentScreenType) => {
  const { contentId, needId, backScreen } = route.params;
  const dispatch = useDispatch();

  const { t } = useTranslationWithRTL();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT));

  // Back button
  useEffect(() => registerBackButton(backScreen, navigation), []);

  const scrollview = useRef<ScrollView | null>(null);

  // On id or locale change
  useEffect(() => {
    // fetch in any case, to reset if needed
    if (contentId && selectedLanguage) {
      dispatch(
        fetchSelectedContentActionCreator({
          contentId,
          locale: selectedLanguage,
        }),
      );
    }
  }, [selectedLanguage, contentId]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));
  const themeId = route.params.theme?._id || selectedContent?.theme;
  const theme = useSelector(themeSelector(themeId?.toString()));
  // On content change
  useEffect(() => {
    if (selectedContent) {
      updateNbVuesOrFavoritesOnContent(selectedContent._id.toString(), ViewsType.MOBILE);
    }
  }, [selectedContent]);

  const refetchContent = useCallback(() => {
    if (contentId && selectedLanguage) {
      return dispatch(
        fetchSelectedContentActionCreator({
          contentId: contentId,
          locale: selectedLanguage,
        }),
      );
    }
    return;
  }, [contentId, selectedLanguage]);

  const scrollTop = () => {
    scrollview.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);
  const lastModificationDate = useMemo(() => selectedContent?.lastModificationDate, [selectedContent]);

  // before leaving, if initialUrl (deeplink), clear it to return to onboarding if necessary
  const initialUrl = useSelector(initialUrlSelector);
  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!initialUrl) return;
        if (!hasUserSeenOnboarding) e.preventDefault();
        dispatch(setInitialUrlActionCreator(null));
      }),
    [navigation, hasUserSeenOnboarding, initialUrl],
  );

  if (isLoading)
    return (
      <Page
        backScreen={backScreen}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent?.titreInformatif}
        title={selectedContent?.titreInformatif}
        loading
        Skeleton={PageSkeleton}
      >
        <ActivityIndicator />
      </Page>
    );

  if (!selectedContent || !currentLanguage || !theme) {
    return (
      <Page backScreen={backScreen}>
        <ErrorScreen
          onButtonClick={refetchContent}
          buttonText={t("content_screen.start_again_button", "Recommencer")}
          text={t(
            "content_screen.error",
            "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard.",
          )}
          buttonIcon="refresh-outline"
        />
      </Page>
    );
  }

  return (
    <>
      <Page
        backScreen={backScreen}
        headerBackgroundImage={theme?.appBanner}
        headerTitle={selectedContent.titreInformatif}
        loading={isLoading}
        Skeleton={PageSkeleton}
        HeaderContent={HeaderContentContentScreen}
        scrollview={scrollview}
        backgroundColor="white" // important to keep radius
        contentContainerStyle={stylesheet.page}
        voiceoverOffset={250}
      >
        <Rows spacing={RowsSpacing.NoSpace}>
          <LanguageUnavailable />

          <Title accessibilityRole="header">
            <ReadableText>{selectedContent.titreInformatif}</ReadableText>
          </Title>

          {!isEmpty(selectedContent.titreMarque) && (
            <TextDSFR_L style={{ marginBottom: styles.margin * 3 }}>
              <ReadableText>{`${t("content_screen.with", "Avec")} ${selectedContent.titreMarque}`}</ReadableText>
            </TextDSFR_L>
          )}

          {selectedContent.typeContenu === ContentType.DEMARCHE && (
            <>
              <DemarcheImage
                contentId={selectedContent._id.toString()}
                isSmall={false}
                logo={selectedContent.administration?.logo?.secure_url}
              />
              <Spacer height={styles.margin * 3} />
            </>
          )}

          <LastModificationDate lastModificationDate={lastModificationDate} />

          <Spacer height={styles.margin * 5} />
          <Section key="what" sectionKey="what" themeId={themeId || null} />

          <InfocardsSection key="infocards" content={selectedContent} color={colors.color100} />

          {CONTENT_STRUCTURES[selectedContent.typeContenu].map(
            (section, i) => section !== "what" && <Section key={i} sectionKey={section} themeId={themeId || null} />,
          )}

          <ExternalLink
            externalLink={selectedContent.externalLink}
            contentId={selectedContent._id}
            backgroundColor={colors.color100}
          />

          <MapMarkers markers={selectedContent.map} contentId={selectedContent._id} color={colors.color100} />
          <Spacer height={styles.margin * 5} />
          <Mercis dispositif={selectedContent} />

          <Separator fullWidth spacing={SeparatorSpacing.XLarge} />

          <LinkedThemesNeeds
            needs={selectedContent.needs}
            theme={selectedContent.theme}
            secondaryThemes={selectedContent.secondaryThemes}
          />

          <Sponsors sponsors={selectedContent.sponsors} />
        </Rows>
        <Spacer height={styles.margin * 8} />

        <RTLView>
          <UpButton scrollTop={scrollTop} />
        </RTLView>
        <Spacer height={styles.margin * 15} />
      </Page>

      <ContentTabBar contentId={selectedContent._id.toString()} needId={needId} theme={theme} />
    </>
  );
};

export default ContentScreen;
