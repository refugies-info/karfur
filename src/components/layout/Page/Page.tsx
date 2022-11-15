import React, { ReactNode } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { useTheme } from "styled-components/native";
import styled from "styled-components/native";
import { useHeaderAnimation } from "../../../hooks/useHeaderAnimation";
import { useVoiceover } from "../../../hooks/useVoiceover";
import Header, { HeaderProps } from "../Header";
import ScrollableContent from "../ScrollableContent";
import { logger } from "../../../logger";
import { useIsFocused } from "@react-navigation/native";

const PageContainer = styled.View`
  flex: 1;
`;

export interface PageProps extends HeaderProps {
  children: ReactNode;
  disableAutomaticScroll?: boolean;
  loading?: boolean;
}

const Page = ({
  disableAutomaticScroll,
  children,
  loading,
  title,
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
      logger.info("VoiceOver :: saveList");
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
      <Header
        {...headerProps}
        title={title}
        showSimplifiedHeader={showSimplifiedHeader}
      />
      {/* {title && (
        <Content>
          <Title>{title}</Title>
        </Content>
      )} */}
      {disableAutomaticScroll ? (
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
