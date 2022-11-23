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
import { Picture } from "../../../types/interface";
import SafeAreaViewTopInset from "../SafeAreaViewTopInset";
import Spacer from "../Spacer";

const PageContainer = styled.View`
  flex: 1;
  min-width: 100%;
`;

export interface PageProps extends Partial<HeaderProps> {
  children: ReactNode;
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  HeaderContent?: ComponentType<HeaderContentProps>;
  loading?: boolean;
  Skeleton?: ComponentType;
  title?: string;
}

const FixedContainerForHeader = styled(Animated.View)`
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  padding-top: ${({ theme }) => theme.insets.top}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
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
  max-width: 100%;
  width: 100%;
  padding-top: ${({ theme }) => theme.layout.header.minHeight}px;
  border-bottom-right-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
  border-bottom-left-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
`;

const Page = ({
  children,
  headerBackgroundColor = "white",
  headerBackgroundImage,
  HeaderContent = HeaderContentEmpty,
  headerTitle,
  loading,
  Skeleton = SkeletonListPage,
  title,
  ...headerProps
}: PageProps) => {
  const theme = useTheme();
  const isFocus = useIsFocused();
  const [initialHeaderSize, setInitialHeaderSize] = useStateOnce<number>();
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation(
    initialHeaderSize && initialHeaderSize - theme.layout.header.minHeight - 10
  ); // Voiceover
  const scrollview = React.useRef<ScrollView>(null);
  const offset = 250;
  const { setScroll, saveList } = useVoiceover(scrollview, offset);

  React.useEffect(() => {
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
  const backgroundColorInterpolation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [
      headerBackgroundColor === "white" ? "white" : "transparent",
      headerBackgroundColor,
    ],
  });

  useEffect(() => {
    toggleSimplifiedHeader(showSimplifiedHeader);
  }, [showSimplifiedHeader]);

  if (title && HeaderContent === HeaderContentEmpty) {
    HeaderContent = withProps({ title })(
      HeaderContentTitle
    ) as ComponentType<HeaderContentProps>;
    headerTitle = title;
  }

  const Container = useMemo(
    () =>
      headerBackgroundImage
        ? withProps({
            resizeMode: "cover",
            source: { uri: getImageUri(headerBackgroundImage.secure_url) },
            style: {
              marginTop: -24,
              marginRight: -24,
              marginLeft: -24,
              marginBottom: theme.margin * 2,
            },
          })(ImageBackground)
        : withProps({
            style: {
              marginTop: -24,
              marginRight: -24,
              marginLeft: -24,
              marginBottom: theme.margin * 2,
            },
          })(View),
    [headerBackgroundImage]
  );

  const onHeaderLayout = useCallback(
    (e) => setInitialHeaderSize(e.nativeEvent.layout.height),
    [setInitialHeaderSize]
  );

  const showHeaderTitle =
    showSimplifiedHeader || HeaderContent === HeaderContentEmpty;

  const scrollableContentContainer = useMemo(
    () => ({
      paddingHorizontal: theme.margin * 3,
      paddingTop: theme.margin * 3,
      paddingBottom: theme.margin * 5 + (theme.insets.bottom || 0),
    }),
    [theme.margin, theme.insets.bottom]
  );

  return (
    <PageContainer>
      <FixedContainerForHeader
        style={{
          backgroundColor:
            HeaderContent === HeaderContentEmpty
              ? "white"
              : backgroundColorInterpolation,
        }}
      >
        <Header
          {...headerProps}
          showTitle={showHeaderTitle}
          headerTitle={headerTitle}
        />
      </FixedContainerForHeader>

      {loading ? (
        <>
          <Spacer height={theme.layout.header.minHeight} />
          <Skeleton />
        </>
      ) : (
        <>
          <ScrollableContent
            alwaysBounceVertical={false}
            contentContainerStyle={scrollableContentContainer}
            onMomentumScrollEnd={onScrollEnd}
            onScroll={handleScroll}
            onScrollEndDrag={onScrollEnd}
            ref={scrollview}
            scrollEventThrottle={26}
          >
            <Container onLayout={onHeaderLayout}>
              <MainContainer
                backgroundColor={
                  headerBackgroundImage ? "transparent" : headerBackgroundColor
                }
                rounded={headerBackgroundImage || headerBackgroundColor}
              >
                <HeaderContent />
              </MainContainer>
            </Container>
            {children}
          </ScrollableContent>
        </>
      )}
    </PageContainer>
  );
};

Page.displayName = "Page";

export default Page;
