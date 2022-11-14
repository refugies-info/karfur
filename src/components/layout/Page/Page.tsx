import React, { ReactNode } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import { useHeaderAnimation } from "../../../hooks/useHeaderAnimation";
import { useVoiceover } from "../../../hooks/useVoiceover";
import Header, { HeaderProps } from "../Header";
import ScrollableContent from "../ScrollableContent";

const PageContainer = styled.View`
  flex: 1;
`;

export interface PageProps extends HeaderProps {
  children: ReactNode;
  disableAutomaticScroll?: boolean;
}

const Page = ({
  disableAutomaticScroll,
  children,
  title,
  ...headerProps
}: PageProps) => {
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation(); // Voiceover
  const scrollview = React.useRef<ScrollView>(null);
  const offset = 250;
  const { setScroll, saveList } = useVoiceover(scrollview, offset);

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
          onMomentumScrollEnd={onScrollEnd}
          onScroll={handleScroll}
          onScrollEndDrag={onScrollEnd}
          ref={scrollview}
          scrollEventThrottle={5}
        >
          {children}
        </ScrollableContent>
      )}
    </PageContainer>
  );
};

Page.displayName = "Page";

export default Page;
