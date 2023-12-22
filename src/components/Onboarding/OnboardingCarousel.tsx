import React from "react";
import { Carousel, Pagination } from "react-native-snap-carousel";
import { View, Dimensions } from "react-native";
import { styles } from "../../theme";
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
  padding-horizontal: ${styles.margin * 3}px;
  width: 100%;
  padding-top: ${styles.margin}px;
`;

const NextButtonContainer = styled(SafeAreaView)`
  position: absolute;
  bottom: ${styles.margin * 3}px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding-horizontal: ${styles.margin * 3}px;
`;

export interface OnboardingCarouselProps {
  navigateBack: Function;
  finishOnboarding: Function;
  t: Function;
}

interface OnboardingCarouselState {
  activeIndex: number;
}

const carouselItems = onboardingCarouselData;
class OnboardingCarousel extends React.Component {
  private carousel: Carousel<any> | null = null;
  props: OnboardingCarouselProps;
  state: OnboardingCarouselState;
  constructor(props: OnboardingCarouselProps) {
    super(props);
    this.props = props;
    this.state = {
      activeIndex: 0,
    };
  }
  _renderItem({ item }: any) {
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
          backgroundColor: styles.colors.white,
          borderWidth: 1,
          borderColor: styles.colors.white,
        }}
        inactiveDotStyle={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: styles.colors.white,
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
          bottom: 115,
        }}
      />
    );
  }
  render() {
    const { activeIndex } = this.state;
    const { t } = this.props;

    return (
      <View
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <TopButtonsContainer edges={["right", "top", "left"]}>
          <SmallButton
            iconName="arrow-back-outline"
            onPress={() => {
              if (activeIndex === 0) {
                this.props.navigateBack();
                return;
              }
              this.carousel?.snapToPrev();
            }}
            label={t("onboarding_screens.back_button_accessibility")}
          />
        </TopButtonsContainer>
        {/* @ts-ignore */}
        <Carousel
          layout={"default"}
          // @ts-ignore
          ref={(ref) => (this.carousel = ref)}
          data={carouselItems}
          renderItem={this._renderItem}
          // @ts-ignore
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
          // @ts-ignore
          currentIndex={activeIndex}
          inverted={false}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          slideStyle={{ width: viewportWidth }}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        {this.pagination}
        <NextButtonContainer edges={["right", "bottom", "left"]}>
          <CustomButton
            i18nKey={
              activeIndex !== 3
                ? "onboarding_screens.next_button"
                : "onboarding_screens.continue_button"
            }
            defaultText={activeIndex !== 3 ? "Suivant" : "Continuer"}
            textColor={styles.colors.black}
            onPress={() => {
              if (activeIndex === carouselItems.length - 1) {
                this.props.finishOnboarding();
                return;
              }
              this.carousel?.snapToNext();
            }}
            iconName="arrow-forward-outline"
          />
        </NextButtonContainer>
      </View>
    );
  }
}

// @ts-ignore
const OnboardingCarouselComponent = withTranslation()(OnboardingCarousel);

export default OnboardingCarouselComponent;
