import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View } from "react-native";
import { tags } from "../../data/tagData";
import { CarousselCard } from "./CarousselCard";
import { sortByOrder } from "../../libs";
import { theme } from "../../theme";

export class TagsCaroussel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
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
    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          backgroundColor: tags[activeIndex].lightColor,
        }}
        inactiveDotStyle={{
          backgroundColor: theme.colors.darkGrey,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  render() {
    return (
      <View>
        <Carousel
          layout={"default"}
          ref={(ref) => (this.carousel = ref)}
          data={this.state.carouselItems}
          sliderWidth={460}
          itemWidth={230}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
        />
        {this.pagination}
      </View>
    );
  }
}
