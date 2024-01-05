import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { ContentType, ViewsType } from "@refugies-info/api-types";

import { ExplorerParamList, BottomTabParamList } from "../../../types";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { fetchSelectedContentActionCreator } from "../../services/redux/SelectedContent/selectedContent.actions";
import { selectedContentSelector } from "../../services/redux/SelectedContent/selectedContent.selectors";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { themeSelector } from "../../services/redux/Themes/themes.selectors";

import { updateNbVuesOrFavoritesOnContent } from "../../utils/API";
import { registerBackButton } from "../../libs/backButton";

import { defaultColors } from "../../libs/getThemeTag";
import { resetReadingList } from "../../services/redux/VoiceOver/voiceOver.actions";
import { useVoiceover } from "../../hooks/useVoiceover";
import { readingListLengthSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
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
  StyledTextNormal,
  Title,
  UpButton,
} from "../../components";
import PageSkeleton from "../SearchTab/ContentScreen/PageSkeleton";
import { Section } from "./Section";
import { Mercis } from "./Sections";
import isEmpty from "lodash/isEmpty";
import LanguageUnavailable from "./LanguageUnavailable";
import { SeparatorSpacing } from "../../components/layout/Separator/Separator";
import { LastModificationDate } from "./LastModificationDate";
import { ExternalLink } from "./ExternalLink";
import { ContentTabBar } from "./ContentTabBar";
import { MapMarkers } from "./MapMarkers";
import { Sponsors } from "./Sponsors";
import { LinkedThemesNeeds } from "./LinkedThemesNeeds";

export type ContentScreenType = CompositeScreenProps<
  StackScreenProps<ExplorerParamList, "ContentScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

const CONTENT_STRUCTURES: Record<
  ContentType,
  ("what" | "how" | "why" | "next")[]
> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const ContentScreen = ({ navigation, route }: ContentScreenType) => {
  const { contentId, needId, backScreen } = route.params;
  const dispatch = useDispatch();

  const { t } = useTranslationWithRTL();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_CONTENT)
  );

  // Back button
  useEffect(() => registerBackButton(backScreen, navigation), []);

  // Voiceover
  const scrollview = useRef<ScrollView | null>(null);
  const offset = 250;
  const { saveList } = useVoiceover(scrollview, offset);

  // On id or locale change
  useEffect(() => {
    // fetch in any case, to reset if needed
    if (contentId && selectedLanguage) {
      dispatch(resetReadingList());
      dispatch(
        fetchSelectedContentActionCreator({
          contentId,
          locale: selectedLanguage,
        })
      );
    }
  }, [selectedLanguage, contentId]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));
  const theme = useSelector(
    themeSelector(
      route.params.theme?._id.toString() || selectedContent?.theme?.toString()
    )
  );
  const readingListLength = useSelector(readingListLengthSelector);
  // On content change
  useEffect(() => {
    if (selectedContent) {
      if (readingListLength === undefined) {
        // new reading list if content is just loaded
        saveList();
      }
      updateNbVuesOrFavoritesOnContent(
        selectedContent._id.toString(),
        ViewsType.MOBILE
      );
    }
  }, [selectedContent]);

  const refetchContent = useCallback(() => {
    if (contentId && selectedLanguage) {
      return dispatch(
        fetchSelectedContentActionCreator({
          contentId: contentId,
          locale: selectedLanguage,
        })
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
  const lastModificationDate = useMemo(
    () => selectedContent?.lastModificationDate,
    [selectedContent]
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
            "Une erreur est survenue. Vérifie que tu es bien connecté à internet. Sinon, réessaie plus tard."
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
        contentContainerStyle={{
          borderTopRightRadius: styles.margin,
          borderTopLeftRadius: styles.margin,
          marginTop: -styles.margin,
        }}
      >
        <Rows spacing={RowsSpacing.NoSpace}>
          <LanguageUnavailable />

          <Title accessibilityRole="header">
            <ReadableText>{selectedContent.titreInformatif}</ReadableText>
          </Title>

          {!isEmpty(selectedContent.titreMarque) && (
            <StyledTextNormal style={{ marginBottom: styles.margin * 3 }}>
              <ReadableText>
                {`${t("content_screen.with", "Avec")} ${
                  selectedContent.titreMarque
                }`}
              </ReadableText>
            </StyledTextNormal>
          )}

          {selectedContent.typeContenu === ContentType.DEMARCHE && (
            <DemarcheImage
              contentId={selectedContent._id.toString()}
              isSmall={false}
            />
          )}

          <LastModificationDate lastModificationDate={lastModificationDate} />

          <Spacer height={styles.margin * 5} />
          <Section key="what" sectionKey="what" />

          <InfocardsSection
            key="infocards"
            content={selectedContent}
            color={colors.color100}
          />

          {CONTENT_STRUCTURES[selectedContent.typeContenu].map(
            (section, i) =>
              section !== "what" && <Section key={i} sectionKey={section} />
          )}

          <ExternalLink
            externalLink={selectedContent.externalLink}
            contentId={selectedContent._id}
            backgroundColor={colors.color100}
          />

          <MapMarkers
            markers={selectedContent.map}
            contentId={selectedContent._id}
            color={colors.color100}
          />
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

      <ContentTabBar
        contentId={selectedContent._id.toString()}
        needId={needId}
        theme={theme}
      />
    </>
  );
};

export default ContentScreen;
