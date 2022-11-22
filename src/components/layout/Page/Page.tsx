import React, { ComponentType, ReactNode } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useHeaderAnimation } from "../../../hooks/useHeaderAnimation";
import { useVoiceover } from "../../../hooks/useVoiceover";
import Header, { HeaderProps } from "../Header";
import ScrollableContent from "../ScrollableContent";
import { useIsFocused } from "@react-navigation/native";
import { SkeletonListPage } from "../../feedback";

const PageContainer = styled.View`
  flex: 1;
`;

export interface PageProps extends HeaderProps {
  children: ReactNode;
  disableAutomaticScroll?: boolean;
  loading?: boolean;
  Skeleton?: ComponentType;
}

const Page = ({
  disableAutomaticScroll,
  children,
  loading,
  Skeleton = SkeletonListPage,
  ...headerProps
}: PageProps) => {
  const theme = useTheme();
  const isFocus = useIsFocused();
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation(); // Voiceover
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

  return (
    <PageContainer>
      <Header {...headerProps} showSimplifiedHeader={showSimplifiedHeader} />
      {loading ? (
        <Skeleton />
      ) : disableAutomaticScroll ? (
        children
      ) : (
        <ScrollableContent
          alwaysBounceVertical={false}
          contentContainerStyle={{
            paddingHorizontal: theme.margin * 3,
            paddingTop: theme.margin * 3,
            paddingBottom: theme.margin * 5 + (theme.insets.bottom || 0),
          }}
          onMomentumScrollEnd={onScrollEnd}
          onScroll={handleScroll}
          onScrollEndDrag={onScrollEnd}
          ref={scrollview}
          scrollEventThrottle={10}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {children}
        </ScrollableContent>
      )}
    </PageContainer>
  );
};

Page.displayName = "Page";

export default Page;
