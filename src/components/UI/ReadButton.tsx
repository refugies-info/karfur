import React, { useCallback, useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import {
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "react-native-eva-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { setReadingItem } from "../../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemSelector,
  currentScrollSelector,
  readingListSelector,
} from "../../services/redux/VoiceOver/voiceOver.selectors";
import { styles } from "../../theme";
import Pause from "../../theme/images/voiceover/pause_icon.svg";
import Play from "../../theme/images/voiceover/play_icon.svg";
import { ReadingItem } from "../../types/interface";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";
import { Animated } from "react-native";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { logger } from "../../logger";

const Container = styled(View)`
  position: absolute;
  bottom: ${(props: { bottomInset: number }) => props.bottomInset}px;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;
const PlayContainer = styled(TouchableOpacity)`
  width: 56px;
  position: absolute;
  bottom: 4px;
  left: 50%;
  margin-left: -28px;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: ${(props: { loading: boolean }) => (props.loading ? 0.4 : 1)};
`;
const PlayButton = styled(View)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${styles.colors.darkBlue};
  z-index: 20;
  align-items: center;
  justify-content: center;
  ${styles.shadows.blue}
`;
const Buttons = styled(Animated.View)`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 48px;
  height: 56px;
  z-index: 1;
  padding: 8px;
`;
const BackgroundContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const Space = styled(View)`
  width: 56px;
  margin-right: 8px;
  margin-left: 8px;
`;
interface ButtonProps {
  mr?: boolean;
  ml?: boolean;
  background?: string;
}
const Button = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props: ButtonProps) => props.background || "white"};
  justify-content: center;
  align-items: center;
  margin-right: ${(props: ButtonProps) => (props.mr ? "8px" : "0")};
  margin-left: ${(props: ButtonProps) => (props.ml ? "8px" : "0")};
  ${styles.shadows.blue}
`;

const MAX_RATE = 1.2;

const sortItems = (a: ReadingItem, b: ReadingItem) => {
  if (a.posY < b.posY) return -1;
  else if (a.posY > b.posY) return 1;
  else if (a.posX < b.posX) -1; // is same horizontal position, check vertical position
  return 1;
};

const getReadingList = (
  list: ReadingItem[],
  startFromId: string | null,
  offset: number
) => {
  const toRead = list.filter((item) => item);
  if (toRead.length === 0) return [];
  const firstItemToRead = startFromId || toRead[0].id;
  const currentItemIndex = toRead.findIndex((i) => i.id === firstItemToRead);
  return toRead.slice(currentItemIndex + offset);
};

interface Props {
  bottomInset: number;
}

export const ReadButton = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRTL();
  const { fontScale } = useWindowDimensions();

  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [resolvedReadingList, setResolvedReadingList] = useState<ReadingItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const readingList = useSelector(readingListSelector);
  const currentItem = useSelector(currentItemSelector);
  const currentScroll = useSelector(currentScrollSelector);

  const [isReading, setIsReading] = useState(false);
  useEffect(() => {
    setIsReading(!!currentItem);
  }, [currentItem]);

  const readText = useCallback(
    (item: ReadingItem, readingList: ReadingItem[]) => {
      setIsPaused(false);
      logger.info("Reading: ", item.text);
      Speech.speak(item.text, {
        rate: rate,
        language: currentLanguageI18nCode || "fr",
        onStart: () => {
          dispatch(setReadingItem(item));
        },
        onDone: () => {
          if (readingList[readingList.length - 1].id === item.id) {
            dispatch(setReadingItem(null));
          }
        },
      });
    },
    [rate, currentLanguageI18nCode]
  );

  const startToRead = useCallback(() => {
    if (Array.isArray(readingList)) {
      setIsLoading(true);
      activateKeepAwake("voiceover");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      logger.info("startToRead, nb items :", readingList.length);
      Promise.all(readingList)
        .then((res) => {
          logger.info("startToRead:: res", res);
          logEventInFirebase(FirebaseEvent.START_VOICEOVER, {
            locale: currentLanguageI18nCode,
          });
          const sortedReadingList = res.sort(sortItems);
          setResolvedReadingList(sortedReadingList);
          const firstItem = sortedReadingList.find(
            (item) => item.posY >= currentScroll
          );
          const toRead = getReadingList(
            sortedReadingList,
            firstItem?.id || null,
            0
          );
          for (const itemToRead of toRead) readText(itemToRead, toRead);
          setIsLoading(false);
        })
        .catch((e) => {
          logger.error(e);
        });
    }
  }, [readingList, currentScroll]);

  const goToNext = () => {
    Speech.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentItem) {
      const toRead = getReadingList(resolvedReadingList, currentItem.id, 1);
      for (const itemToRead of toRead) readText(itemToRead, toRead);
    }
  };

  const goToPrevious = () => {
    Speech.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentItem) {
      const toRead = getReadingList(resolvedReadingList, currentItem.id, -1);
      for (const itemToRead of toRead) readText(itemToRead, toRead);
    }
  };

  const resumeReading = () => {
    if (currentItem) {
      const toRead = getReadingList(resolvedReadingList, currentItem.id, 0);
      for (const itemToRead of toRead) readText(itemToRead, toRead);
    }
  };

  const stopVoiceOver = useCallback(() => {
    deactivateKeepAwake("voiceover");
    Speech.stop();
    if (isReading) {
      // test to prevent haptic on any navigate
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(setReadingItem(null));
    setIsPaused(false);
  }, [isReading]);

  const changeRate = () => {
    setRate((rate) => (rate === 1 ? MAX_RATE : 1));
  };

  // Stop when reset
  useEffect(() => {
    if (readingList === null) {
      stopVoiceOver();
    }
  }, [readingList]);

  // change rate
  useEffect(() => {
    Speech.stop();
    if (currentItem) {
      const toRead = getReadingList(resolvedReadingList, currentItem.id, 0);
      for (const itemToRead of toRead) readText(itemToRead, toRead);
    }
  }, [rate]);

  // change language
  useEffect(() => {
    stopVoiceOver();
  }, [currentLanguageI18nCode]);

  // pause
  useEffect(() => {
    if (isPaused) {
      if (Platform.OS === "android") {
        Speech.stop();
      } else {
        Speech.pause();
      }
    } else {
      if (Platform.OS === "android") {
        resumeReading();
      } else {
        Speech.resume();
      }
    }
  }, [isPaused]);

  // show menu
  useEffect(() => {
    if (isReading) {
      Animated.spring(animatedValue, {
        toValue: 1,
        bounciness: 14,
        speed: 24,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [isReading]);

  // start
  const toggleVoiceOver = () => {
    if (!isReading) {
      startToRead();
    } else {
      setIsPaused(!isPaused);
    }
  };

  return (
    <Container bottomInset={props.bottomInset}>
      <PlayContainer
        loading={isLoading}
        onPress={toggleVoiceOver}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("tab_bar.listen", "Écouter")}
      >
        <PlayButton>
          {isReading && !isPaused ? (
            <Pause width={16} height={16} />
          ) : (
            <Play width={16} height={16} />
          )}
        </PlayButton>
        {fontScale < 1.3 && (
          <StyledTextVerySmall style={{ color: styles.colors.darkGrey }}>
            {t("tab_bar.listen", "Écouter")}
          </StyledTextVerySmall>
        )}
      </PlayContainer>
      <Buttons style={animatedStyle}>
        <BackgroundContainer>
          <Image
            source={require("../../theme/images/voiceover/bg_voiceover.png")}
            style={{ marginLeft: -8, marginTop: -8 }}
          />
        </BackgroundContainer>
        <Button onPress={changeRate}>
          <StyledTextSmallBold>{rate === 1 ? "x1" : "x2"}</StyledTextSmallBold>
        </Button>
        <Button onPress={goToPrevious} ml>
          <Icon
            name={"arrow-back-outline"}
            height={24}
            width={24}
            fill={styles.colors.black}
          />
        </Button>
        <Space />
        <Button onPress={goToNext} mr>
          <Icon
            name={"arrow-forward-outline"}
            height={24}
            width={24}
            fill={styles.colors.black}
          />
        </Button>
        <Button onPress={stopVoiceOver} background={styles.colors.red}>
          <Icon
            name={"close-outline"}
            height={24}
            width={24}
            fill={styles.colors.white}
          />
        </Button>
      </Buttons>
    </Container>
  );
};
