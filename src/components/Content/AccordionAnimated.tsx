import * as React from "react";
import styled from "styled-components/native";
import { View, StyleSheet, Animated } from "react-native";
import { AvailableLanguageI18nCode, ObjectId } from "../../types/interface";
import { theme } from "../../theme";
import { RTLView, RTLTouchableOpacity } from "../BasicComponents";
import { TextSmallBold } from "../StyledText";
import { AccordionHeaderFromHtml } from "./AccordionHeaderFromHtml";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ContentFromHtml } from "./ContentFromHtml";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";

const TitleContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isExpanded: boolean; lightColor: string }) =>
    props.isExpanded ? props.lightColor : theme.colors.white};
  padding:${theme.margin * 2}px;
  border-radius:${theme.radius * 2}px
  box-shadow: ${(props: { isExpanded: boolean }) =>
    props.isExpanded
      ? `0px 0px 0px ${theme.colors.white}`
      : "0px 8px 16px rgba(33, 33, 33, 0.24)"};
  elevation: ${(props: { isExpanded: boolean }) => (props.isExpanded ? 0 : 1)};
  justify-content:space-between;
  border: ${(props: { isExpanded: boolean; darkColor: string }) =>
    props.isExpanded
      ? `2px solid ${props.darkColor}`
      : `2px solid ${theme.colors.white}`} ;
    align-items:center;
`;

const AccordionContainer = styled.View`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const StepContainer = styled.View`
  width: 32px;
  height: 32px;
  background-color: ${(props: { darkColor: string }) => props.darkColor};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;

const StepText = styled(TextSmallBold)`
  color: ${theme.colors.white};
`;

const ExpandedContentContainer = styled.View`
  padding: ${theme.margin}px;
`;
const IconContainer = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const TitleText = styled(TextSmallBold)`
  width: ${(props: { width: number }) => props.width}px;
  color: ${(props: { darkColor: string }) => props.darkColor};
`;
const styles = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
    textAlign: "right",
  },

  bodyContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

interface Props {
  title: string;
  content: string;
  stepNumber: number | null;
  width: number;
  currentLanguage: AvailableLanguageI18nCode | null;
  windowWidth: number;
  darkColor: string;
  lightColor: string;
  isContentTranslated: boolean;
  shouldTriggerFirebaseEvent: boolean;
  contentId: ObjectId;
}

export const AccordionAnimated = (props: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleAccordion = () => setIsExpanded(!isExpanded);
  const animatedController = React.useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = React.useState(0);
  const [hasSentEventInFirebase, setHasSentEventInFirebase] = React.useState(
    false
  );

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const { isRTL } = useTranslationWithRTL();

  const toggleListItem = () => {
    if (isExpanded) {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }

    if (!hasSentEventInFirebase && props.shouldTriggerFirebaseEvent) {
      logEventInFirebase(FirebaseEvent.CLIC_ACCORDION_ENGAGEMENT, {
        contentId: props.contentId,
      });
      setHasSentEventInFirebase(true);
    }
    toggleAccordion();
  };

  return (
    <AccordionContainer>
      <View>
        <TitleContainer
          isExpanded={isExpanded}
          darkColor={props.darkColor}
          lightColor={props.lightColor}
          onPress={() => toggleListItem()}
        >
          <RTLView>
            {props.stepNumber && (
              <StepContainer isRTL={isRTL} darkColor={props.darkColor}>
                <StepText>{props.stepNumber}</StepText>
              </StepContainer>
            )}
            {!props.isContentTranslated ? (
              <TitleText width={props.width} darkColor={props.darkColor}>
                {props.title}
              </TitleText>
            ) : (
              <AccordionHeaderFromHtml
                htmlContent={props.title}
                width={props.width}
                windowWidth={props.windowWidth}
                darkColor={props.darkColor}
              />
            )}
          </RTLView>
          <IconContainer isRTL={isRTL}>
            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              height={24}
              width={24}
              fill={props.darkColor}
            />
          </IconContainer>
        </TitleContainer>
        {
          <Animated.View
            style={[styles.bodyBackground, { height: bodyHeight }]}
          >
            <View
              onLayout={(event: any) =>
                setBodySectionHeight(event.nativeEvent.layout.height)
              }
              style={styles.bodyContainer}
            >
              <ExpandedContentContainer>
                {!!props.content && (
                  <ContentFromHtml
                    htmlContent={props.content}
                    windowWidth={props.windowWidth}
                  />
                )}
              </ExpandedContentContainer>
            </View>
          </Animated.View>
        }
      </View>
    </AccordionContainer>
  );
};
