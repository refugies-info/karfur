import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Animated,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useHeaderAnimation } from "../../../hooks/useHeaderAnimation";
import { useVoiceover } from "../../../hooks/useVoiceover";
import Header, {
  HeaderContentEmpty,
  HeaderContentProps,
  HeaderContentTitle,
  HeaderProps,
} from "../Header";
import ScrollableContent from "../ScrollableContent";
import { useIsFocused } from "@react-navigation/native";
import { SkeletonListPage } from "../../feedback";
import { useStateOnce } from "../../../hooks";
import { withProps } from "../../../utils";
import { getImageUri } from "../../../libs/getImageUri";
import { hexToRgb } from "../../utils/isDarkColor/hexToRgb";
import SafeAreaViewTopInset from "../SafeAreaViewTopInset";
import Spacer from "../Spacer";
import { isDarkColor } from "../../utils";
import { Picture } from "@refugies-info/api-types";

const PageContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  flex: 1;
  min-width: 100%;
  min-height: 100%;
`;

export interface PageProps extends Partial<HeaderProps> {
  backgroundColor?: string;
  children: ReactNode;
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  HeaderContent?: ComponentType<HeaderContentProps>;
  loading?: boolean;
  Skeleton?: ComponentType;
  title?: string;
  contentContainerStyle?: ViewStyle;
  scrollview?: React.RefObject<ScrollView>; // given by parent if we need to control scroll
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

const MainContainer = styled(SafeAreaViewTopInset)<{
  backgroundColor: string;
  showShadow: boolean;
  rounded: boolean;
}>`
  z-index: 4;
  ${({ showShadow, theme }) => (showShadow ? theme.shadows.xs : "")}
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ theme }) => theme.layout.content.normal};
  min-height: ${({ theme }) =>
    theme.layout.header.minHeight + theme.insets.top}px;
  width: 100%;
  padding-top: ${({ theme }) => theme.layout.header.minHeight}px;
  border-bottom-right-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
  border-bottom-left-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
`;

const ContentContainer = styled.View<{ backgroundColor: string }>`
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding-top: ${({ theme }) => theme.margin * 3}px;
  background-color: ${({ backgroundColor }) => backgroundColor || "white"};
  flex-grow: 1;
`;

const indicatorInsets = { right: 1 };

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
  ...headerProps
}: PageProps) => {
  const theme = useTheme();
  const isFocus = useIsFocused();
  const [initialHeaderSize, setInitialHeaderSize] = useStateOnce<number>();
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation(
    initialHeaderSize && initialHeaderSize - theme.layout.header.minHeight - 10
  ); // Voiceover
  const contentScrollview = React.useRef<ScrollView>(null);
  const offset = 200;
  const { setScroll, saveList } = useVoiceover(
    scrollview || contentScrollview,
    offset
  );

  useEffect(() => {
    // Run saveList only if the screen is focused
    if (!isFocus) return;

    // reset when finish loading
    if (!loading) {
      setTimeout(() => saveList());
    }
  }, [loading, isFocus]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(
      event.nativeEvent.contentOffset.y,
      showSimplifiedHeader ? offset : 0
    );
  };

  const animatedController = useRef(new Animated.Value(0)).current;
  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    Animated.timing(animatedController, {
      duration: 200,
      toValue: displayHeader ? 1 : 0, // show or hide header
      useNativeDriver: false,
    }).start();
  };
  const rgbColor = useMemo(() => {
    const { r, g, b } = hexToRgb(headerBackgroundColor);
    return `${r},${g},${b}`;
  }, [headerBackgroundColor]);
  const backgroundColorInterpolation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [`rgba(${rgbColor},0)`, headerBackgroundColor],
  });

  useEffect(() => {
    toggleSimplifiedHeader(showSimplifiedHeader);
  }, [showSimplifiedHeader]);

  const HeaderContentInternal = useMemo(() => {
    if (title && HeaderContent === HeaderContentEmpty) {
      return withProps({
        title,
      })(HeaderContentTitle) as ComponentType<HeaderContentProps>;
    }
    return HeaderContent;
  }, [HeaderContent, title]);

  if (title && HeaderContent === HeaderContentEmpty) {
    headerTitle = title;
  }

  const Container = useMemo(
    () =>
      headerBackgroundImage
        ? withProps({
            resizeMode: "cover",
            source: { uri: getImageUri(headerBackgroundImage.secure_url) },
            style: {
              height: 240,
            },
          })(ImageBackground)
        : withProps({})(View),
    [headerBackgroundImage]
  );

  const onHeaderLayout = useCallback(
    (e: any) => setInitialHeaderSize(e.nativeEvent.layout.height),
    [setInitialHeaderSize]
  );

  const showHeaderTitle =
    showSimplifiedHeader || HeaderContentInternal === HeaderContentEmpty;

  const scrollableContentContainer = useMemo(
    () => ({
      paddingBottom: theme.insets.bottom,
      flexGrow: 1,
    }),
    [theme.margin, theme.insets.bottom]
  );

  const isDarkBackground = useMemo(
    () => isDarkColor(headerBackgroundColor),
    [headerBackgroundColor]
  );

  return (
    <PageContainer backgroundColor={backgroundColor}>
      <FixedContainerForHeader
        style={{
          backgroundColor:
            HeaderContent === HeaderContentEmpty
              ? headerBackgroundColor
              : backgroundColorInterpolation,
        }}
      >
        <Header
          {...headerProps}
          darkBackground={isDarkBackground}
          showTitle={showHeaderTitle}
          headerTitle={headerTitle}
          changeLanguageCallback={() => setScroll(0, 0)}
        />
      </FixedContainerForHeader>

      {loading ? (
        <>
          <Spacer height={theme.layout.header.minHeight + theme.margin * 2} />
          <Skeleton />
        </>
      ) : (
        <>
          {/* @ts-ignore */}
          <ScrollableContent
            alwaysBounceVertical={false}
            contentContainerStyle={scrollableContentContainer}
            onMomentumScrollEnd={onScrollEnd}
            onScroll={handleScroll}
            onScrollEndDrag={onScrollEnd}
            ref={scrollview || contentScrollview}
            scrollEventThrottle={26}
            scrollIndicatorInsets={indicatorInsets}
          >
            <Container onLayout={onHeaderLayout}>
              <MainContainer
                backgroundColor={
                  headerBackgroundImage
                    ? "rgba(255,255,255,0)"
                    : headerBackgroundColor
                }
                rounded={headerBackgroundImage || headerBackgroundColor}
              >
                <HeaderContentInternal darkBackground={isDarkBackground} />
              </MainContainer>
            </Container>

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
