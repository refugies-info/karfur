import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import {
  TextSmallBold,
  TextVerySmallNormal,
} from "../../components/StyledText";
import { ExplorerParamList } from "../../../types";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { View, Animated } from "react-native";
import { needsSelector } from "../../services/redux/Needs/needs.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { ObjectId, Need } from "../../types/interface";
import { ScrollView } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import SkeletonContent from "react-native-skeleton-content";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { HeaderWithBackForWrapper } from "../../components/HeaderWithLogo";
import { NeedsHeaderAnimated } from "../../components/Needs/NeedsHeaderAnimated";

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

const NeedContainer = styled(RTLTouchableOpacity)`
  padding:${theme.margin * 2}px
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  box-shadow: 0px 8px 16px rgba(33, 33, 33, 0.24);
  
  justify-content:space-between;
  align-items :center
`;

const StyledText = styled(TextSmallBold)`
  color: ${(props: { color: string }) => props.color};
`;

const IndicatorContainer = styled.View`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  padding: ${theme.margin}px;
  align-self: center;
  border-radius: 8px;
  height: 32px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${theme.colors.white};
`;

export const NeedsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);

  const animatedController = React.useRef(new Animated.Value(0)).current;

  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    if (displayHeader && !showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 400,
        toValue: 1,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(true);
      return;
    }

    if (!displayHeader && showSimplifiedHeader) {
      Animated.timing(animatedController, {
        duration: 400,
        toValue: 0,
        useNativeDriver: false,
      }).start();
      setShowSimplifiedHeader(false);
      return;
    }
  };

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 30) {
      toggleSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 30) {
      toggleSimplifiedHeader(false);
      return;
    }
    return;
  };

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

  const { t, isRTL } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  const {
    tagName,
    tagDarkColor,
    tagVeryLightColor,
    tagLightColor,
    iconName,
  } = route.params;

  const allNeeds = useSelector(needsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  const needsToDisplay = computeNeedsToDisplay(
    allNeeds,
    groupedContents,
    tagName
  );

  if (isLoading) {
    return (
      <View>
        <View style={{ backgroundColor: tagDarkColor }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
          />
        </View>
        <NeedsHeaderAnimated
          tagDarkColor={tagDarkColor}
          headerBottomRadius={headerBottomRadius}
          headerHeight={headerHeight}
          headerPaddingTop={headerPaddingTop}
          tagName={tagName}
          headerFontSize={headerFontSize}
          iconName={iconName}
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

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <View style={{ backgroundColor: tagDarkColor }}>
        <HeaderWithBackForWrapper
          onLongPressSwitchLanguage={toggleLanguageModal}
          navigation={navigation}
        />
      </View>
      <NeedsHeaderAnimated
        tagDarkColor={tagDarkColor}
        headerBottomRadius={headerBottomRadius}
        headerHeight={headerHeight}
        headerPaddingTop={headerPaddingTop}
        tagName={tagName}
        headerFontSize={headerFontSize}
        iconName={iconName}
        showSimplifiedHeader={showSimplifiedHeader}
      />

      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.margin * 3,
          paddingTop: theme.margin * 3,
          paddingBottom: theme.margin * 3,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {needsToDisplay.map((need) => {
          const needText =
            currentLanguageI18nCode &&
            need[currentLanguageI18nCode] &&
            // @ts-ignore
            need[currentLanguageI18nCode].text
              ? // @ts-ignore
                need[currentLanguageI18nCode].text
              : need.fr.text;
          const indicatorText =
            need.nbContents < 2
              ? need.nbContents + " " + t("NeedsScreen.fiche", "fiche")
              : need.nbContents + " " + t("NeedsScreen.fiches", "fiches");
          return (
            <NeedContainer
              key={need._id}
              onPress={() =>
                navigation.navigate("ContentsScreen", {
                  tagName,
                  tagDarkColor,
                  tagVeryLightColor,
                  tagLightColor,
                  needId: need._id,
                  iconName,
                })
              }
            >
              <StyledText color={tagDarkColor}>{needText}</StyledText>
              <IndicatorContainer backgroundColor={tagLightColor} isRTL={isRTL}>
                <IndicatorText>{indicatorText}</IndicatorText>
              </IndicatorContainer>
            </NeedContainer>
          );
        })}
      </ScrollView>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
