import React from "react";
import styled from "styled-components/native";
import { ScrollView, View } from "react-native";
import { theme } from "../../theme";
import { SimplifiedContent } from "../../types/interface";
import { getCardColors } from "../../libs/content";
import { sortByOrder } from "../../libs";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { tags } from "../../data/tagData";
import { StyledTextNormalBold } from "../StyledText";

const ListSubtitle = styled(StyledTextNormalBold)`
  margin-top: ${theme.margin * 7}px;
  margin-bottom: ${theme.margin * 3}px;
`;

interface Props {
  handleScroll: any;
  contents: SimplifiedContent[];
  navigation: any;
}

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const scrollview = React.useRef<ScrollView>(null);

  React.useLayoutEffect(() => {
    setTimeout(() => {
      if (isRTL) {
        scrollview.current?.scrollToEnd({ animated: false });
      } else {
        scrollview.current?.scrollTo({ x: 0, y: 0, animated: false });
      }
    });
  }, [isRTL])

  return (
    <ScrollView
      style={{ flex: 1 }}
      onScroll={props.handleScroll}
      scrollEventThrottle={20}
    >
      <View style={{ marginHorizontal: theme.margin * 3 }}>
        <ListSubtitle isRTL={isRTL}>
          {t("SearchScreeen.Les fiches les plus recherchées", "Les fiches les plus recherchées")}
        </ListSubtitle>

        {(props.contents || []).map((content: SimplifiedContent) => {
          const colors = getCardColors(content)
          return (
            <ContentSummary
              key={content._id}
              navigation={props.navigation}
              tagDarkColor={colors.tagDarkColor}
              tagVeryLightColor={colors.tagVeryLightColor}
              tagName={colors.tagName}
              tagLightColor={colors.tagLightColor}
              iconName={colors.iconName}
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
          {t("SearchScreeen.Les thèmes", "Les thèmes")}
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
                  tagName: tag.name,
                  tagDarkColor: tag.darkColor,
                  tagVeryLightColor: tag.color30,
                  tagLightColor: tag.lightColor,
                  iconName: tag.icon,
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