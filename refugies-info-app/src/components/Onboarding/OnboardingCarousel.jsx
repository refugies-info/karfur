import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View, Dimensions, SafeAreaView } from "react-native";
import { tags } from "../../data/tagData";
import { theme } from "../../theme";
import i18n from "../../services/i18n";
import { OnboardingCarouselElement } from "./OnboardingCarouselElement";
import { CustomButton } from "../../components/CustomButton";
import { SmallButton } from "../SmallButton";
import styled from "styled-components/native";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const TopButtonsContainer = styled.View`
  position: absolute;
  top: 10px;
  left: 0px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${theme.margin * 3}px;
  padding-top: ${theme.margin}px;
  width: 100%;
`;

const NextButtonContainer = styled.View`
  position: absolute;
  bottom: ${theme.margin * 3}px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding-horizontal: ${theme.margin * 3}px;
`;

const carouselItems = [
  { element: "element1", color: "red" },
  { element: "element2", color: "blue" },
  { element: "element3", color: "green" },
];
export class OnboardingCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }
  _renderItem({ item }) {
    return <OnboardingCarouselElement text={item.element} color={item.color} />;
  }

  goToNextSlide() {}

  get pagination() {
    const { activeIndex } = this.state;
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
        }}
        inactiveDotStyle={{
          backgroundColor: theme.colors.darkGrey,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          bottom: 100,
        }}
      />
    );
  }
  render() {
    const isRTL = i18n.isRTL();
    const { activeIndex } = this.state;

    return (
      <View>
        <TopButtonsContainer>
          <SmallButton
            iconName="arrow-back-outline"
            onPress={() => {
              if (activeIndex === 0) {
                this.props.navigateBack();
                return;
              }
              this.carousel.snapToPrev();
            }}
          />
          <SmallButton iconName="volume-up-outline" />
        </TopButtonsContainer>
        <Carousel
          layout={"default"}
          ref={(ref) => (this.carousel = ref)}
          data={carouselItems}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
          currentIndex={activeIndex}
          inverted={false}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          slideStyle={{ width: viewportWidth }}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        {this.pagination}
        <NextButtonContainer>
          <CustomButton
            textColor={theme.colors.black}
            onPress={() => {
              if (activeIndex === carouselItems.length - 1) {
                this.props.finishOnboarding();
                return;
              }
              this.carousel.snapToNext();
            }}
            iconName="arrow-forward-outline"
          />
        </NextButtonContainer>
      </View>
    );
  }
}
