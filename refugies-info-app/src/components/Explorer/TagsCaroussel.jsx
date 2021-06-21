import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View } from "react-native";
import { tags } from "../../data/tagData";
import { CarousselCard } from "./CarousselCard";
import { sortByOrder } from "../../libs";
import { theme } from "../../theme";
import i18n from "../../services/i18n";

export class TagsCaroussel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
      carouselItems: tags.sort(sortByOrder),
    };
  }
  _renderItem({ item }) {
    return (
      <CarousselCard
        tagName={item.name}
        colorLight={item.lightColor}
        colorVeryLight={item.veryLightColor}
        iconName={item.icon}
      />
    );
  }

  get pagination() {
    const { carouselItems, activeIndex } = this.state;
    const isRTL = i18n.isRTL();
    const activeDotIndex = isRTL
      ? carouselItems.length - activeIndex - 1
      : activeIndex;

    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeDotIndex}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          backgroundColor: tags[activeIndex].lightColor,
          marginHorizontal: -2,
        }}
        inactiveDotStyle={{
          backgroundColor: theme.colors.darkGrey,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        animatedDuration={1000}
        animatedTension={150}
      />
    );
  }
  render() {
    const isRTL = i18n.isRTL();
    const { activeIndex } = this.state;

    return (
      <View>
        <Carousel
          layout={"default"}
          ref={(ref) => (this.carousel = ref)}
          data={this.state.carouselItems}
          sliderWidth={460}
          itemWidth={232}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
          currentIndex={activeIndex}
          inverted={isRTL}
          firstItem={1}
          initialNumToRender={12}
          inactiveSlideScale={0.75}
        />
        {this.pagination}
      </View>
    );
  }
}
