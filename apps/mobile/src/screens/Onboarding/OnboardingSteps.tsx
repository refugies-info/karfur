import { Dimensions } from "react-native";
import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import styled from "styled-components/native";
import { OnboardingParamList } from "../../../types";
import PageOnboarding from "../../components/layout/PageOnboarding";
import { OnboardingCarouselElement } from "../../components/Onboarding/OnboardingCarouselElement";
import { TAB_BAR_HEIGHT } from "../../components/layout/PageOnboarding/PageOnboarding";
import { OnboardingPagination } from "../../components/Onboarding/OnboardingPagination";
import { useStopVoiceover } from "../../hooks/useStopVoiceover";

const MAX_STEP = 5;

const PaginationContainer = styled.View<{ insetTop: number }>`
  position: absolute;
  z-index: 3;
  top: ${({ theme, insetTop }) => insetTop + theme.margin * 2}px;
  right: ${({ theme }) => theme.margin * 3}px;
`;

export const OnboardingSteps = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "OnboardingSteps">) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const ref = React.useRef<ICarouselInstance>(null);
  const [index, setIndex] = React.useState(0);

  // stop voiceover when changing screen
  const stopVoiceover = useStopVoiceover();

  const onPrevious = () => {
    stopVoiceover();
    if (index > 0) {
      ref.current?.prev();
    } else {
      navigation.navigate("LanguageChoice");
    }
  };

  const onNext = () => {
    stopVoiceover();
    if (index < MAX_STEP - 1) {
      ref.current?.next();
    } else {
      navigation.navigate("FilterCity");
    }
  };

  return (
    <PageOnboarding noScrollable onNext={onNext} onPrevious={onPrevious}>
      <PaginationContainer insetTop={insets.top}>
        <OnboardingPagination step={index + 1} maxStep={MAX_STEP} />
      </PaginationContainer>

      <Carousel
        ref={ref}
        width={width}
        height={height - TAB_BAR_HEIGHT - insets.bottom}
        loop={false}
        data={[...new Array(MAX_STEP).keys()]}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setIndex(index)}
        renderItem={(item) => (
          <OnboardingCarouselElement
            step={item.index}
            focused={isFocused && index === item.index}
          />
        )}
      />
    </PageOnboarding>
  );
};
