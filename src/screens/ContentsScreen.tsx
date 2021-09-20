import * as React from "react";
import { ExplorerParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { TextNormal, TextNormalBold } from "../components/StyledText";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { contentsSelector } from "../services/redux/Contents/contents.selectors";
import { ScrollView, View, Animated } from "react-native";
import styled from "styled-components/native";
import { theme } from "../theme";
import { needNameSelector } from "../services/redux/Needs/needs.selectors";
import { groupedContentsSelector } from "../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { isLoadingSelector } from "../services/redux/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../services/redux/LoadingStatus/loadingStatus.actions";
import { HeaderWithBackForWrapper } from "../components/HeaderWithLogo";
import SkeletonContent from "react-native-skeleton-content";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { ContentsHeaderAnimated } from "../components/Contents/ContentsHeaderAnimated";

const ContentContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.grey60};
  margin-bottom: ${theme.margin * 3}px;
  padding: 16px;
`;

export const ContentsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "ContentsScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];
  const {
    tagName,
    tagDarkColor,
    tagVeryLightColor,
    tagLightColor,
    needId,
    iconName,
  } = route.params;

  const groupedContents = useSelector(groupedContentsSelector);
  const contentsId = groupedContents[needId];

  const contentsToDisplay = contentsId.map((contentId: any) => {
    const contentWithInfosArray = contents.filter(
      (content) => content._id === contentId
    );
    if (contentWithInfosArray.length > 0) return contentWithInfosArray[0];
    return null;
  });

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
    // console.log("scrollPos", scrollPos);
    // if (event.nativeEvent.contentOffset.y - scrollPos < 5) {
    //   setScrollPos(event.nativeEvent.contentOffset.y);
    // }
    // if (event.nativeEvent.contentOffset.y <) {
    //   toggleSimplifiedHeader(true);
    //   return;
    // }
    if (event.nativeEvent.contentOffset.y < 0.01) {
      toggleSimplifiedHeader(false);
      return;
    }
    return;
  };

  const onScrollBeginDrag = () => {
    if (!showSimplifiedHeader) {
      toggleSimplifiedHeader(true);
    }
  };

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
        <View style={{ backgroundColor: tagDarkColor }}>
          <HeaderWithBackForWrapper
            onLongPressSwitchLanguage={toggleLanguageModal}
            navigation={navigation}
          />
        </View>
        <ContentsHeaderAnimated
          tagDarkColor={tagDarkColor}
          headerBottomRadius={headerBottomRadius}
          headerPaddingTop={headerPaddingTop}
          tagName={tagName}
          headerFontSize={headerFontSize}
          iconName={iconName}
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
      <View style={{ backgroundColor: tagDarkColor }}>
        <HeaderWithBackForWrapper
          onLongPressSwitchLanguage={toggleLanguageModal}
          navigation={navigation}
        />
      </View>
      <ContentsHeaderAnimated
        tagDarkColor={tagDarkColor}
        headerBottomRadius={headerBottomRadius}
        headerPaddingTop={headerPaddingTop}
        tagName={tagName}
        headerFontSize={headerFontSize}
        iconName={iconName}
        showSimplifiedHeader={showSimplifiedHeader}
        navigation={navigation}
        needName={needName}
        nbContents={contentsToDisplay.length}
        isLoading={false}
        tagHeight={tagHeight}
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
        alwaysBounceVertical={false}
        onScrollBeginDrag={onScrollBeginDrag}
      >
        {contentsToDisplay.map((content, index) => {
          if (!content)
            return (
              <View>
                <TextNormalBold>Erreur</TextNormalBold>
              </View>
            );
          return (
            <ContentContainer
              key={index}
              onPress={() =>
                navigation.navigate("ContentScreen", {
                  contentId: content._id,
                  tagDarkColor,
                  tagVeryLightColor,
                  tagName,
                  tagLightColor,
                })
              }
            >
              <TextNormal>{content.titreInformatif}</TextNormal>
              {!!content.titreMarque && (
                <TextNormal>{" - " + content.titreMarque}</TextNormal>
              )}
            </ContentContainer>
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
