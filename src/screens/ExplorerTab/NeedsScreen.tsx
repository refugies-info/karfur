import * as React from "react";
import { theme } from "../../theme";
import { ExplorerParamList } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { View, Animated, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { needsSelector } from "../../services/redux/Needs/needs.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { ObjectId, Need } from "../../types/interface";
import { ScrollView } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { HeaderWithBackForWrapper } from "../../components/HeaderWithLogo";
import { NeedsHeaderAnimated } from "../../components/Needs/NeedsHeaderAnimated";
import { ErrorScreen } from "../../components/ErrorScreen";
import { NeedsSummary } from "../../components/Needs/NeedsSummary";
import { registerBackButton } from "../../libs/backButton";
import { newReadingList, setScrollReading } from "../../services/redux/VoiceOver/voiceOver.actions";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { useFocusEffect } from "@react-navigation/native";

const computeNeedsToDisplay = (
  allNeeds: Need[],
  groupedContents: Record<ObjectId, ObjectId[]>,
  tagName: string
) => {
  const filteredNeeds = allNeeds.filter((need) => {
    if (
      need.tagName === tagName &&
      groupedContents[need._id] &&
      groupedContents[need._id].length > 0
    )
      return true;
    return false;
  });

  return filteredNeeds
    .map((need) => {
      return { ...need, nbContents: groupedContents[need._id].length };
    })
    .sort((a, b) => {
      if (a.nbContents > b.nbContents) return -1;
      return 1;
    });
};


export const NeedsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const dispatch = useDispatch();

  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);

  const animatedController = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

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
    if (event.nativeEvent.contentOffset.y > 10) {
      toggleSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 10) {
      toggleSimplifiedHeader(false);
      return;
    }
    return;
  };

  // Voiceover
  const scrollview = React.useRef<ScrollView|null>(null);
  const offset = 250;
  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScroll = showSimplifiedHeader ?
      event.nativeEvent.contentOffset.y + offset :
      0;
    dispatch(setScrollReading(currentScroll))
  }
  useAutoScroll(scrollview, offset);

  useFocusEffect(React.useCallback(() => {
    scrollview.current?.scrollTo({ x: 0, y: 0, animated: false });
    dispatch(newReadingList());
  }, []));

  const headerHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [90, 40],
  });

  const headerBottomRadius = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const headerPaddingTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { t } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  const {
    colors,
    backScreen
  } = route.params;

  const allNeeds = useSelector(needsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  // Back button
  React.useEffect(() => registerBackButton(backScreen, navigation), []);

  const needsToDisplay = computeNeedsToDisplay(
    allNeeds,
    groupedContents,
    colors.tagName
  );

  React.useEffect(() => { // reset when finish loading
    if (!isLoading) {
      setTimeout(() => {
        dispatch(newReadingList());
      });
    }
  }, [isLoading]);

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
        <NeedsHeaderAnimated
          tagDarkColor={colors.tagDarkColor}
          headerBottomRadius={headerBottomRadius}
          headerHeight={headerHeight}
          headerPaddingTop={headerPaddingTop}
          tagName={colors.tagName}
          headerFontSize={headerFontSize}
          iconName={colors.iconName}
          showSimplifiedHeader={showSimplifiedHeader}
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

  if (needsToDisplay.length === 0) {
    return (
      <View style={{ display: "flex", flex: 1 }}>
        <View style={{ backgroundColor: colors.tagDarkColor }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
            backScreen={backScreen}
          />
        </View>
        <NeedsHeaderAnimated
          tagDarkColor={colors.tagDarkColor}
          headerBottomRadius={headerBottomRadius}
          headerHeight={headerHeight}
          headerPaddingTop={headerPaddingTop}
          tagName={colors.tagName}
          headerFontSize={headerFontSize}
          iconName={colors.iconName}
          showSimplifiedHeader={showSimplifiedHeader}
        />
        <ErrorScreen
          buttonText={t("tab_bar.explorer")}
          text={t(
            "needs_screen.no_result",
            "Nous sommes désolés, nous n'avons pas de fiche ici"
          )}
          onButtonClick={navigation.goBack}
          buttonIcon="compass-outline"
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
      <NeedsHeaderAnimated
        tagDarkColor={colors.tagDarkColor}
        headerBottomRadius={headerBottomRadius}
        headerHeight={headerHeight}
        headerPaddingTop={headerPaddingTop}
        tagName={colors.tagName}
        headerFontSize={headerFontSize}
        iconName={colors.iconName}
        showSimplifiedHeader={showSimplifiedHeader}
      />

      <ScrollView
        ref={scrollview}
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.margin * 3,
          paddingTop: theme.margin * 3,
          paddingBottom: theme.margin * 5 + (insets.bottom || 0),
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        alwaysBounceVertical={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
      >
        {needsToDisplay.map((need) => {
          const needText =
            currentLanguageI18nCode &&
            need[currentLanguageI18nCode]?.text
              ? //@ts-ignore
                need[currentLanguageI18nCode].text
              : need.fr.text;

          return (
            <NeedsSummary
              key={need._id}
              id={need._id}
              needText={needText}
              needTextFr={need.fr.text}
              nbContents={need.nbContents}
              navigation={navigation}
              themeTag={colors}
              style={{ marginBottom: theme.margin * 3 }}
            />
          )
        })}
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
