import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { useVoiceover } from "../../../hooks/useVoiceover";
import ScrollableContent from "../ScrollableContent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ButtonDSFR } from "../../buttons";
import { ReadButton } from "../../UI";

export const TAB_BAR_HEIGHT = 80;

const PageContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.dsfr_backgroundBlue};
  flex: 1;
`;
const ContentContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding-vertical: ${({ theme }) => theme.margin * 3}px;
`;
const BottomTabBar = styled.View<{ insetBottom: number }>`
  background-color: white;
  height: ${({ insetBottom }) => TAB_BAR_HEIGHT + insetBottom}px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-bottom: ${({ insetBottom }) => insetBottom}px;
  padding-top: ${({ theme }) => theme.margin * 2}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.colors.dsfr_borderGrey};
`;

const READ_BUTTON_SIZE = 64;
const ReadButtonContainer = styled.View`
  width: ${READ_BUTTON_SIZE}px;
  height: 100%;
  margin-top: -${READ_BUTTON_SIZE / 2}px;
  margin-left: auto;
  margin-right: auto;
`;

export interface PageProps {
  children?: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  hideNavbar?: boolean;
  noScrollable?: boolean;
}

const PageOnboarding = ({
  children,
  onNext,
  onPrevious,
  hideNavbar,
  noScrollable,
}: PageProps) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Voiceover
  const contentScrollview = React.useRef<ScrollView>(null);
  const { setScroll } = useVoiceover(contentScrollview, 0);

  const resetScroll = useCallback(() => {
    setScroll(0, 0);
  }, [setScroll]);

  // on mount, reset scroll
  useEffect(() => {
    resetScroll();
  }, [resetScroll]);

  const insetBottom = useMemo(
    () => (insets.bottom > 0 ? insets.bottom - 8 : 0),
    [insets.bottom]
  );

  return (
    <PageContainer>
      {noScrollable ? (
        <View style={{ paddingBottom: insetBottom + TAB_BAR_HEIGHT }}>
          {children}
        </View>
      ) : (
        <ScrollableContent
          alwaysBounceVertical={false}
          scrollIndicatorInsets={{ right: 1 }}
          contentContainerStyle={{
            paddingBottom: insetBottom + TAB_BAR_HEIGHT,
            paddingTop: insets.top,
          }}
        >
          <ContentContainer>{children}</ContentContainer>
        </ScrollableContent>
      )}

      {!hideNavbar && (
        <BottomTabBar insetBottom={insetBottom}>
          {onPrevious && (
            <ButtonDSFR
              accessibilityLabel={t(
                "onboarding_screens.back_button_accessibility"
              )}
              onPress={onPrevious}
              priority="secondary"
              iconName="arrow-back"
            ></ButtonDSFR>
          )}
          <ReadButtonContainer>
            <ReadButton bottomInset={0} />
          </ReadButtonContainer>
          {onNext && (
            <ButtonDSFR
              accessibilityLabel={t("onboarding_screens.next_button")}
              onPress={onNext}
              priority="primary"
              iconName="arrow-forward-outline"
            ></ButtonDSFR>
          )}
        </BottomTabBar>
      )}
    </PageContainer>
  );
};

PageOnboarding.displayName = "PageOnboarding";

export default PageOnboarding;
