import { Picture } from "@refugies-info/api-types";
import React, { ComponentType, ReactNode, useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  ViewStyle,
} from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import styled, { useTheme } from "styled-components/native";
import { useStateOnce } from "~/hooks";
import { useHeaderAnimation } from "~/hooks/useHeaderAnimation";
import { useVoiceover } from "~/hooks/useVoiceover";
import { SkeletonListPage } from "../../feedback";
import { isDarkColor } from "../../utils";
import { hexToRgb } from "../../utils/isDarkColor/hexToRgb";
import Header, {
  HeaderContentEmpty,
  HeaderContentProps,
  HeaderContentTitle,
  HeaderContentTitleProps,
  HeaderProps,
} from "../Header";
import ScrollableContent from "../ScrollableContent";
import Spacer from "../Spacer";
import PageHeader from "./PageHeader";

const PageContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  flex: 1;
  min-width: 100%;
  min-height: 100%;
`;

export interface PageProps extends Partial<HeaderProps> {
  backgroundColor?: string;
  voiceoverOffset?: number;
  children?: ReactNode;
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  HeaderContent?: ComponentType<HeaderContentProps>;
  loading?: boolean;
  Skeleton?: ComponentType;
  title?: string;
  contentContainerStyle?: ViewStyle;
  scrollview?: React.RefObject<ScrollView | FlatList>; // given by parent if we need to control scroll
  flatList?: FlatListProps<any>;
}

//  padding-top: ${({ theme }) => theme.insets.top}px;
const FixedContainerForHeader = styled(Animated.View)`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding-vertical: ${({ theme }) => theme.margin}px;
  width: 100%;
`;

const ContentContainer = styled.View<{ backgroundColor: string }>`
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding-top: ${({ theme }) => theme.margin * 3}px;
  background-color: ${({ backgroundColor }) => backgroundColor || "white"};
  flex-grow: 1;
`;

const Page = ({
  backgroundColor = "transparent",
  children,
  headerBackgroundColor = "white",
  headerBackgroundImage,
  HeaderContent = HeaderContentEmpty,
  headerTitle,
  loading,
  Skeleton = SkeletonListPage,
  contentContainerStyle = {},
  title,
  scrollview,
  flatList,
  voiceoverOffset,
  ...headerProps
}: PageProps) => {
  const theme = useTheme();
  const [initialHeaderSize, setInitialHeaderSize] = useStateOnce<number>();
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation(
    initialHeaderSize && initialHeaderSize - theme.layout.header.minHeight - 10,
  ); // Voiceover
  const contentScrollview = React.useRef<ScrollView>(null);
  const offset = voiceoverOffset || 200;
  const { setScroll } = useVoiceover(scrollview || contentScrollview, offset);

  const resetScroll = useCallback(() => {
    setScroll(0, 0);
  }, [setScroll]);

  // on mount, reset scroll
  useEffect(() => {
    resetScroll();
  }, [resetScroll]);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScroll(event.nativeEvent.contentOffset.y, showSimplifiedHeader ? offset : 0);
    },
    [setScroll],
  );

  const bgController = useSharedValue(0);
  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    bgController.value = withTiming(displayHeader ? 1 : 0, { duration: 200 });
  };

  const rgbColor = useMemo(() => {
    const { r, g, b } = hexToRgb(headerBackgroundColor);
    return `${r},${g},${b}`;
  }, [headerBackgroundColor]);
  const animatedBg = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(bgController.value, [0, 1], [`rgba(${rgbColor},0)`, headerBackgroundColor]),
  }));

  useEffect(() => {
    toggleSimplifiedHeader(showSimplifiedHeader);
  }, [showSimplifiedHeader]);

  const HeaderContentInternal = useMemo(() => {
    if (title && HeaderContent === HeaderContentEmpty) {
      const component: React.FC<Omit<HeaderContentTitleProps, "title">> = (props) => (
        <HeaderContentTitle title={title} {...props} />
      );
      component.displayName = "HeaderContentTitleWithTitle";
      return component;
    }
    return HeaderContent;
  }, [HeaderContent, title]);

  if (title && HeaderContent === HeaderContentEmpty) {
    headerTitle = title;
  }

  const onHeaderLayout = useCallback(
    (e: any) => setInitialHeaderSize(e.nativeEvent.layout.height),
    [setInitialHeaderSize],
  );

  const showHeaderTitle = showSimplifiedHeader || HeaderContentInternal === HeaderContentEmpty;

  const isDarkBackground = useMemo(() => isDarkColor(headerBackgroundColor), [headerBackgroundColor]);

  const scrollViewProps: ScrollViewProps | FlatListProps<any> = useMemo(
    () => ({
      alwaysBounceVertical: false,
      style: {
        paddingBottom: theme.insets.bottom,
        flexGrow: 1,
      },
      contentContainerStyle: { flexGrow: 1 },
      onMomentumScrollEnd: onScrollEnd,
      onScroll: handleScroll,
      onScrollEndDrag: onScrollEnd,
      ref: scrollview || contentScrollview,
      scrollEventThrottle: 26,
      scrollIndicatorInsets: { right: 1 },
    }),
    [onScrollEnd, handleScroll, scrollview, contentScrollview],
  );

  return (
    <PageContainer backgroundColor={backgroundColor}>
      <FixedContainerForHeader
        style={HeaderContent === HeaderContentEmpty ? { backgroundColor: headerBackgroundColor } : [animatedBg]}
      >
        <Header
          {...headerProps}
          darkBackground={isDarkBackground}
          showTitle={showHeaderTitle}
          headerTitle={headerTitle}
          changeLanguageCallback={resetScroll}
        />
      </FixedContainerForHeader>

      {loading ? (
        <>
          <Spacer height={theme.layout.header.minHeight + theme.margin * 2} />
          <Skeleton />
        </>
      ) : flatList ? (
        <FlatList
          {...flatList}
          {...scrollViewProps}
          ListHeaderComponent={
            <PageHeader
              HeaderContentInternal={HeaderContentInternal}
              isDarkBackground={isDarkBackground}
              onHeaderLayout={onHeaderLayout}
              headerBackgroundColor={headerBackgroundColor}
              headerBackgroundImage={headerBackgroundImage}
              HeaderContent={HeaderContent}
              style={{ marginBottom: theme.margin * 3 }}
            />
          }
        />
      ) : (
        <>
          {/* @ts-ignore */}
          <ScrollableContent {...scrollViewProps}>
            <PageHeader
              HeaderContentInternal={HeaderContentInternal}
              isDarkBackground={isDarkBackground}
              onHeaderLayout={onHeaderLayout}
              headerBackgroundColor={headerBackgroundColor}
              headerBackgroundImage={headerBackgroundImage}
              HeaderContent={HeaderContent}
            />

            <ContentContainer
              /* @ts-ignore */
              style={contentContainerStyle}
              backgroundColor={backgroundColor}
            >
              {children}
            </ContentContainer>
          </ScrollableContent>
        </>
      )}
    </PageContainer>
  );
};

Page.displayName = "Page";

export default Page;
