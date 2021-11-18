import Carousel, { Pagination } from "react-native-snap-carousel";
import React from "react";
import { View, Dimensions } from "react-native";
import { theme } from "../../theme";
import { OnboardingCarouselElement } from "./OnboardingCarouselElement";
import { CustomButton } from "../../components/CustomButton";
import { SmallButton } from "../SmallButton";
import styled from "styled-components/native";
import { onboardingCarouselData } from "./OnboardingCarouselData";
import { SafeAreaView } from "react-native-safe-area-context";
import { withTranslation } from "react-i18next";

const { width: viewportWidth } = Dimensions.get("window");

const TopButtonsContainer = styled(SafeAreaView)`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${theme.margin * 3}px;
  width: 100%;
  padding-top: ${theme.margin}px;
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

const carouselItems = onboardingCarouselData;
class OnboardingCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }
  _renderItem({ item }) {
    return <OnboardingCarouselElement step={item.stepNumber} />;
  }

  goToNextSlide() {}

  get pagination() {
    const { activeIndex } = this.state;

    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          backgroundColor: theme.colors.white,
          borderWidth: 1,
          borderColor: theme.colors.white,
        }}
        inactiveDotStyle={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.white,
          width: 8,
          height: 8,
          borderRadius: 5,
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
        containerStyle={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          bottom: 90,
        }}
      />
    );
  }
  render() {
    const { activeIndex } = this.state;
    const { t } = this.props;

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
            label={t("Retour")}
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
            i18nKey={activeIndex !== 3 ? "Suivant" : "Continuer"}
            defaultText={activeIndex !== 3 ? "Suivant" : "Continuer"}
            textColor={theme.colors.black}
            onPress={() => {
              if (activeIndex === carouselItems.length - 1) {
                this.props.finishOnboarding();
                return;
              }
              this.carousel.snapToNext();
            }}
            iconName={activeIndex !== 3 ? "arrow-forward-outline" : null}
          />
        </NextButtonContainer>
      </View>
    );
  }
}

export default withTranslation()(OnboardingCarousel)