import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View, Dimensions } from "react-native";
import { tags } from "../../data/tagData";
import { CarousselCard } from "./CarousselCard";
import { sortByOrder } from "../../libs";
import { styles } from "../../theme";
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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <CarousselCard
        tag={item as ExpandedTag}
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
        //@ts-ignore
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
          width: styles.margin,
          height: styles.margin,
          borderRadius: styles.margin / 2,
          backgroundColor: tags[activeIndex].lightColor,
          marginHorizontal: -2,
        }}
        inactiveDotStyle={{
          backgroundColor: styles.colors.darkGrey,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        animatedTension={10}
      />
    </View>
  );
}
