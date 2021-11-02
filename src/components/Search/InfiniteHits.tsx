import React from "react";
import { View, FlatList } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
// import Highlight from "./Highlight";
import { ContentSummary } from "../Contents/ContentSummary";
import { theme } from "../../theme"
import { tags } from "../../data/tagData";

interface Props {
  hits: any[]
  hasMore: boolean
  refineNext: any,
  navigation: any,
}

const InfiniteHits = ({ hits, hasMore, refineNext, navigation }: Props) => {
  /**
   * Return colors of the ContentSummary card
   * @param content
   */
   const getCardColors = (content: any) => {
    const defaultColors = {
      tagDarkColor: theme.colors.black,
      tagVeryLightColor: theme.colors.white,
      tagName: "",
      tagLightColor: theme.colors.white,
      iconName: ""
    };
    const primaryTagName = content.tagsShort.length > 0 ? content.tagsShort[0] : null;
    if (!primaryTagName) return defaultColors;
    const currentTag = tags.find(t => primaryTagName === t.short);
    if (!currentTag) return defaultColors;

    return {
      tagDarkColor: currentTag.darkColor,
      tagVeryLightColor: currentTag.veryLightColor,
      tagName: currentTag.name,
      tagLightColor: currentTag.lightColor,
      iconName: currentTag.icon
    }
  }

  return (
    <FlatList
      data={hits}
      keyExtractor={item => item.objectID}
      onEndReached={() => hasMore && refineNext()}
      style={{paddingTop: theme.margin * 2}}
      renderItem={({ item }) => {
        const colors = getCardColors(item);

        return (
          <View
            key={item.objectID}
            style={{
              flex: 1,
              marginHorizontal: theme.margin * 2,
              marginBottom: theme.margin * 2
            }}
          >
            {/* <Highlight attribute="titre" hit={item} /> */}
            <ContentSummary
              navigation={navigation}
              route={"SearchContentScreen"}
              tagDarkColor={colors.tagDarkColor}
              tagVeryLightColor={colors.tagVeryLightColor}
              tagName={colors.tagName}
              tagLightColor={colors.tagLightColor}
              iconName={colors.iconName}
              contentId={item.objectID}
              titreInfo={item.titreInformatif}
              titreMarque={item.titreMarque}
              typeContenu={item.typeContenu}
              sponsorUrl={item.sponsorUrl}
            />
            </View>
        )
      }}
    />
  )
}

export default connectInfiniteHits(InfiniteHits);