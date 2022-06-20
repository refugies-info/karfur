import * as React from "react";
import { ExplorerParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { contentsSelector } from "../services/redux/Contents/contents.selectors";
import { ScrollView, View, Animated, Platform, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { theme } from "../theme";
import { needNameSelector } from "../services/redux/Needs/needs.selectors";
import { groupedContentsSelector } from "../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import { HeaderWithBackForWrapper } from "../components/HeaderWithLogo";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { ContentsHeaderAnimated } from "../components/Contents/ContentsHeaderAnimated";
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
import { useFocusEffect } from "@react-navigation/native";
import { resetReadingList, setScrollReading } from "../services/redux/VoiceOver/voiceOver.actions";
import { useAutoScroll } from "../hooks/useAutoScroll";

const SectionHeaderText = styled(TextBigBold)`
  color: ${(props: { color: string }) => props.color};
  margin-top: ${theme.margin * 6}px;
  margin-bottom: ${theme.margin * 3}px;
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

  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetReadingList());
    }, [])
  );

  const { t } = useTranslationWithRTL();
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = useSelector(contentsSelector);
  const {
    colors,
    needId,
    backScreen
  } = route.params;

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

  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);

  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);

  const animatedController = React.useRef(new Animated.Value(0)).current;

  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    if (displayHeader && !showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 200,
        toValue: 1,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(true);
      return;
    }

    if (!displayHeader && showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 200,
        toValue: 0,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(false);
      return;
    }
  };

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      toggleSimplifiedHeader(true);
      return;
    }

    if (Platform.OS === "ios" && event.nativeEvent.contentOffset.y < 0) {
      toggleSimplifiedHeader(false);
      return;
    }
    return;
  };

  // Voiceover
  const scrollview = React.useRef<ScrollView|null>(null);
  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = showSimplifiedHeader ? 400 : 600;
    dispatch(setScrollReading(event.nativeEvent.contentOffset.y + offset))
  }
  useAutoScroll(scrollview, 400);

  const headerBottomRadius = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const headerPaddingTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const tagHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  if (isLoading) {
    return (
      <View>
        <View style={{ backgroundColor: colors.tagDarkColor }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
            backScreen={backScreen}
          />
        </View>
        <ContentsHeaderAnimated
          tagDarkColor={colors.tagDarkColor}
          headerBottomRadius={headerBottomRadius}
          headerPaddingTop={headerPaddingTop}
          tagName={colors.tagName}
          headerFontSize={headerFontSize}
          iconName={colors.iconName}
          showSimplifiedHeader={showSimplifiedHeader}
          navigation={navigation}
          needName={needName}
          nbContents={0}
          isLoading={true}
          tagHeight={tagHeight}
        />

        <SkeletonContent
          containerStyle={{
            display: "flex",
            flex: 1,
            marginTop: theme.margin * 3,
            marginHorizontal: theme.margin * 3,
          }}
          isLoading={true}
          layout={[
            {
              key: "Section1",
              width: "100%",
              height: 80,
              marginBottom: theme.margin * 3,
            },
            {
              key: "Section2",
              width: "100%",
              height: 80,
              marginBottom: theme.margin * 3,
            },
            {
              key: "Section3",
              width: "100%",
              height: 80,
              marginBottom: theme.margin * 3,
            },
          ]}
          boneColor={theme.colors.grey}
          highlightColor={theme.colors.lightGrey}
        />
        <LanguageChoiceModal
          isModalVisible={isLanguageModalVisible}
          toggleModal={toggleLanguageModal}
        />
      </View>
    );
  }

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <View style={{ backgroundColor: colors.tagDarkColor }}>
        <HeaderWithBackForWrapper
          onLongPressSwitchLanguage={toggleLanguageModal}
          navigation={navigation}
          backScreen={backScreen}
        />
      </View>
      <ContentsHeaderAnimated
        tagDarkColor={colors.tagDarkColor}
        headerBottomRadius={headerBottomRadius}
        headerPaddingTop={headerPaddingTop}
        tagName={colors.tagName}
        headerFontSize={headerFontSize}
        iconName={colors.iconName}
        showSimplifiedHeader={showSimplifiedHeader}
        navigation={navigation}
        needName={needName}
        nbContents={contentsToDisplay.length}
        isLoading={false}
        tagHeight={tagHeight}
      />

      <ScrollView
        ref={scrollview}
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.margin * 3,
          paddingTop: theme.margin * 3,
          paddingBottom: theme.margin * 3,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        alwaysBounceVertical={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
      >
        {sortedTranslatedContents.map((content) => {
          return (
            <ContentSummary
              key={content._id}
              navigation={navigation}
              themeTag={colors}
              contentId={content._id}
              needId={needId}
              titreInfo={content.titreInformatif}
              titreMarque={content.titreMarque}
              typeContenu={content.typeContenu}
              sponsorUrl={content.sponsorUrl}
              style={{marginBottom: theme.margin * 3}}
            />
          );
        })}

        {sortedNonTranslatedContents.length > 0 && (
          <View>
            <SectionHeaderText color={colors.tagDarkColor}>
              {t("contents_screen.non_translated_content", "Fiches non traduites")}
            </SectionHeaderText>
            {sortedNonTranslatedContents.map((content) => {
              return (
                <ContentSummary
                  key={content._id}
                  navigation={navigation}
                  themeTag={colors}
                  contentId={content._id}
                  needId={needId}
                  titreInfo={content.titreInformatif}
                  titreMarque={content.titreMarque}
                  typeContenu={content.typeContenu}
                  sponsorUrl={content.sponsorUrl}
                  style={{marginBottom: theme.margin * 3}}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
