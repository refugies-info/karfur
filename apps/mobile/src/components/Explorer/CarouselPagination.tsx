import { useEffect } from "react";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { themesSelector } from "~/services";
import { styles } from "~/theme";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.margin * 6}px;
`;
const DotElement = styled(Animated.View)`
  width: ${({ theme }) => theme.margin}px;
  height: ${({ theme }) => theme.margin}px;
  border-radius: ${({ theme }) => theme.margin / 2}px;
  margin-horizontal: 6px;
`;

interface DotProps {
  activeColor: string;
  active: boolean;
}

const INACTIVE_DOT_OPACITY = 0.4;
const INACTIVE_DOT_SCALE = 0.6;

const Dot = ({ activeColor, active }: DotProps) => {
  const opacity = useSharedValue(INACTIVE_DOT_OPACITY);
  const transform = useSharedValue(INACTIVE_DOT_SCALE);
  const color = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: transform.value }],
    backgroundColor: interpolateColor(color.value, [0, 1], [styles.colors.darkGrey, activeColor]),
  }));

  useEffect(() => {
    if (active) {
      opacity.value = withTiming(1);
      transform.value = withTiming(1);
      color.value = withTiming(1);
    } else {
      opacity.value = withTiming(INACTIVE_DOT_OPACITY);
      transform.value = withTiming(INACTIVE_DOT_SCALE);
      color.value = withTiming(0);
    }
  }, [active]);

  return <DotElement style={[animated]} />;
};

interface Props {
  size: number;
  activeDotIndex: number;
}

export const CarouselPagination = ({ size, activeDotIndex }: Props) => {
  const themes = useSelector(themesSelector);

  return (
    <Container>
      {[...new Array(size).keys()].map((index) => (
        <Dot key={index} active={index === activeDotIndex} activeColor={themes[index].colors.color80} />
      ))}
    </Container>
  );
};
