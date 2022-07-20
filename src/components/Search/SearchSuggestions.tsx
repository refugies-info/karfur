import React from "react";
import styled from "styled-components/native";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { theme } from "../../theme";
import { SimplifiedContent } from "../../types/interface";
import { getThemeTag } from "../../libs/getThemeTag";
import { sortByOrder } from "../../libs";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { tags } from "../../data/tagData";
import { StyledTextNormalBold } from "../StyledText";
import { initHorizontalScroll } from "../../libs/rtlHorizontalScroll";
import { setScrollReading } from "../../services/redux/VoiceOver/voiceOver.actions";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { ReadableText } from "../ReadableText";

const ListSubtitle = styled(StyledTextNormalBold)`
  margin-top: ${theme.margin * 7}px;
  margin-bottom: ${theme.margin * 3}px;
`;

interface Props {
  handleScroll?: any;
  contents: SimplifiedContent[];
  navigation: any;
}

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const scrollview = React.useRef<ScrollView>(null);
  const parentScrollview = React.useRef<ScrollView>(null);

  const insets = useSafeAreaInsets();

  React.useLayoutEffect(() => {
    initHorizontalScroll(scrollview, isRTL)
  }, [isRTL])

  // Voiceover
  const dispatch = useDispatch();
  const offset = 350;
  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    dispatch(setScrollReading(event.nativeEvent.contentOffset.y + offset))
  }
  useAutoScroll(parentScrollview, offset);

  return (
    <ScrollView
      ref={parentScrollview}
      style={{ flex: 1 }}
      onScroll={props.handleScroll}
      scrollEventThrottle={20}
      onMomentumScrollEnd={onScrollEnd}
      onScrollEndDrag={onScrollEnd}
      contentContainerStyle={{
        paddingBottom: theme.margin * 5 + insets.bottom
      }}
    >
      <View style={{ marginHorizontal: theme.margin * 3 }}>
        <ListSubtitle isRTL={isRTL}>
          <ReadableText>
            {t("search_screen.most_searched_content", "Les fiches les plus recherchées")}
          </ReadableText>
        </ListSubtitle>

        {(props.contents || []).map((content: SimplifiedContent) => {
          const tagName = content.tags.length > 0 ? content.tags[0].name : "";
          const colors = getThemeTag(tagName)
          return (
            <ContentSummary
              key={content._id}
              navigation={props.navigation}
              themeTag={colors}
              contentId={content._id}
              titreInfo={content.titreInformatif}
              titreMarque={content.titreMarque}
              typeContenu={content.typeContenu}
              sponsorUrl={content.sponsorUrl}
              style={{ marginBottom: theme.margin * 3 }}
              backScreen="Search"
            />
          )
        })}
      </View>
      <View>
        <ListSubtitle style={{ marginHorizontal: theme.margin * 3 }} isRTL={isRTL}>
            <ReadableText>
              {t("search_screen.themes", "Les thèmes")}
            </ReadableText>
        </ListSubtitle>
        <ScrollView
          ref={scrollview}
          contentContainerStyle={{
            flexDirection: !isRTL ? "row" : "row-reverse",
            flexWrap: "wrap",
            width: 1100,
            paddingHorizontal: theme.margin * 3,
            paddingBottom: theme.margin,
            marginBottom: theme.margin
          }}
          horizontal={true}
        >
          {tags.sort(sortByOrder).map((tag, index) => (
            <TagButton
              key={index}
              tagName={tag.name}
              backgroundColor={tag.darkColor}
              iconName={tag.icon}
              inline={true}
              onPress={() => {
                props.navigation.navigate("NeedsScreen", {
                  colors: {
                    tagName: tag.name,
                    tagDarkColor: tag.darkColor,
                    tagVeryLightColor: tag.color30,
                    tagLightColor: tag.lightColor,
                    iconName: tag.icon,
                  },
                  backScreen: "Search"
                });
                return;
              }}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default SearchSuggestions;