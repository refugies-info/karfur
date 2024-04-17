import Carousel from "react-native-reanimated-carousel";
import React, { useEffect } from "react";
import { View, Dimensions, StyleProp, ViewStyle } from "react-native";
import { CarousselCard } from "./CarousselCard";
import { sortByOrder } from "../../libs";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useSelector } from "react-redux";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import { CarouselPagination } from "./CarouselPagination";

const MIN_CARD_WIDTH = 248;
const CARD_RATIO = 0.775;
const CAROUSEL_CONFIG = {
  parallaxScrollingScale: 1,
  parallaxScrollingOffset: -10,
  parallaxAdjacentItemScale: 0.75,
};

const carouselStyle: StyleProp<ViewStyle> = {
  width: Dimensions.get("window").width,
  alignItems: "center",
  justifyContent: "center",
};

export const TagsCarousel = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const themes = useSelector(themesSelector);
  const carouselItems = themes.sort(sortByOrder);

  // TODO : improve here to have responsive cards
  const cardWidth = Math.max(
    Dimensions.get("window").width * 0,
    MIN_CARD_WIDTH
  );
  const cardHeight = cardWidth / CARD_RATIO;

  useEffect(() => {
    if (isRTL) setActiveIndex(carouselItems.length - 1);
    else setActiveIndex(0);
  }, [isRTL]);

  const renderItem = ({ item }: { item: any }) => (
    <CarousselCard
      key={item._id.toString()}
      theme={item}
      navigation={props.navigation}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
    />
  );
  return (
    <View>
      <Carousel
        loop={false}
        data={!isRTL ? carouselItems : carouselItems.reverse()}
        defaultIndex={!isRTL ? 0 : carouselItems.length - 1}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
        width={cardWidth}
        height={cardHeight}
        mode="parallax"
        modeConfig={CAROUSEL_CONFIG}
        style={carouselStyle}
      />
      <CarouselPagination
        size={carouselItems.length}
        activeDotIndex={activeIndex}
      />
    </View>
  );
};
