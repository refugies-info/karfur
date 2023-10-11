import * as React from "react";
import styled from "styled-components/native";
import { View, StyleSheet, Animated } from "react-native";
import { styles } from "../../theme";
import { RTLTouchableOpacity } from "../BasicComponents";
import { TextSmallBold } from "../StyledText";
import { AccordionHeaderFromHtml } from "./AccordionHeaderFromHtml";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ContentFromHtml } from "./ContentFromHtml";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { ReadableText } from "../ReadableText";
import { useSelector } from "react-redux";
import { currentItemSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { Languages } from "@refugies-info/api-types";
import { Columns } from "../layout";

const TitleContainer = styled(RTLTouchableOpacity)<{
  darkColor: string;
  isExpanded: boolean;
  lightColor: string;
}>`
  background-color: ${({ isExpanded, lightColor, theme }) =>
    isExpanded ? lightColor : theme.colors.white};
  padding: ${styles.margin * 2}px;
  border-radius: ${styles.radius * 2}px
    ${(props: { isExpanded: boolean }) =>
      !props.isExpanded ? styles.shadows.lg : ""};
  justify-content: space-between;
  border: ${({ darkColor, isExpanded, theme }) =>
    isExpanded ? `2px solid ${darkColor}` : `2px solid ${theme.colors.white}`};
  align-items: center;
`;

const AccordionContainer = styled.View`
  margin-bottom: ${styles.margin}px;
  margin-top: ${styles.margin}px;
`;

const StepContainer = styled.View<{ darkColor: string }>`
  width: 32px;
  height: 32px;
  background-color: ${({ darkColor }) => darkColor};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : styles.margin * 2)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? styles.margin * 2 : 0)}px;
`;

const StepText = styled(TextSmallBold)`
  color: ${styles.colors.white};
`;

const ExpandedContentContainer = styled.View`
  padding: ${styles.margin}px;
`;
const IconContainer = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
`;

const TitleText = styled(TextSmallBold)`
  width: ${(props: { width: number }) => props.width}px;
  color: ${(props: { darkColor: string }) => props.darkColor};
`;
const stylesheet = StyleSheet.create({
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
  currentLanguage: Languages | null;
  windowWidth: number;
  darkColor: string;
  lightColor: string;
  isContentTranslated: boolean;
  isAccordionEngagement: boolean;
  contentId: string;
}

export const AccordionAnimated = (props: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleAccordion = () => setIsExpanded(!isExpanded);
  const animatedController = React.useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = React.useState(0);
  const [hasSentEventInFirebase, setHasSentEventInFirebase] =
    React.useState(false);
  const currentItemRef = React.useRef<string>("");

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

    if (!hasSentEventInFirebase) {
      if (props.isAccordionEngagement) {
        logEventInFirebase(FirebaseEvent.CLIC_ACCORDION_ENGAGEMENT, {
          contentId: props.contentId,
        });
      }
      logEventInFirebase(FirebaseEvent.CLIC_ACCORDION, {
        contentId: props.contentId,
      });
      setHasSentEventInFirebase(true);
    }
    toggleAccordion();
  };

  // Voiceover
  const currentItem = useSelector(currentItemSelector);

  React.useEffect(() => {
    const accordionIsReading =
      currentItem && currentItem.id === currentItemRef.current;
    setIsExpanded(!!accordionIsReading);

    if (accordionIsReading) {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 1,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 500,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [currentItem]);

  if (!props.title || !props.content) return null;

  return (
    <AccordionContainer>
      <TitleContainer
        isExpanded={isExpanded}
        darkColor={props.darkColor}
        lightColor={props.lightColor}
        onPress={toggleListItem}
        accessibilityRole="button"
        accessibilityLabel={props.title}
        accessibilityState={{ expanded: isExpanded }}
      >
        <Columns layout="auto 1 auto" verticalAlign="center" RTLBehaviour>
          {props.stepNumber && (
            <StepContainer darkColor={props.darkColor}>
              <StepText>{props.stepNumber}</StepText>
            </StepContainer>
          )}
          {!props.isContentTranslated ? (
            <TitleText width={props.width} darkColor={props.darkColor}>
              <ReadableText>{props.title}</ReadableText>
            </TitleText>
          ) : (
            <AccordionHeaderFromHtml
              htmlContent={props.title}
              width={props.width}
              windowWidth={props.windowWidth}
              darkColor={props.darkColor}
            />
          )}
          <IconContainer isRTL={isRTL}>
            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              height={24}
              width={24}
              fill={props.darkColor}
            />
          </IconContainer>
        </Columns>
      </TitleContainer>

      <Animated.View
        style={[stylesheet.bodyBackground, { height: bodyHeight }]}
      >
        <View
          onLayout={(event: any) =>
            setBodySectionHeight(event.nativeEvent.layout.height)
          }
          style={stylesheet.bodyContainer}
        >
          <ExpandedContentContainer>
            {!!props.content && (
              <ContentFromHtml
                ref={currentItemRef}
                htmlContent={props.content}
                windowWidth={props.windowWidth}
                fromAccordion={true}
              />
            )}
          </ExpandedContentContainer>
        </View>
      </Animated.View>
    </AccordionContainer>
  );
};
