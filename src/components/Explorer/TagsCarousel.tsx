import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View, Dimensions } from "react-native";
import { tags } from "../../data/tagData";
import { CarousselCard } from "./CarousselCard";
import { sortByOrder } from "../../libs";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ExpandedTag } from "../../types/interface";

const MIN_CARD_WIDTH = 248;
const CARD_RATIO = 0.775;

export const TagsCarousel = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const carouselItems = tags.sort(sortByOrder);

  // TODO : improve here to have responsive cards
  const cardWidth = Math.max(Dimensions.get("window").width * 0, MIN_CARD_WIDTH);
  const cardHeight = cardWidth / CARD_RATIO;

  const renderItem = ({ item }: { item: ExpandedTag }) => {
    return (
      <CarousselCard
        tag={item}
        navigation={props.navigation}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
      />
    );
  }

  return (
    <View>
      <Carousel
        layout={"default"}
        data={carouselItems}
        sliderWidth={460}
        itemWidth={cardWidth}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
        inverted={isRTL}
        firstItem={0}
        initialNumToRender={12}
        inactiveSlideScale={0.75}
      />

      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={isRTL
          ? carouselItems.length - activeIndex - 1
          : activeIndex
        }
        dotStyle={{
          width: theme.margin,
          height: theme.margin,
          borderRadius: theme.margin / 2,
          backgroundColor: tags[activeIndex].lightColor,
          marginHorizontal: -2,
        }}
        inactiveDotStyle={{
          backgroundColor: theme.colors.darkGrey,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        animatedTension={10}
      />
    </View>
  );
}
