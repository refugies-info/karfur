import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Haptics from "expo-haptics";
import { deactivateKeepAwake } from "expo-keep-awake";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-eva-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import {
  setReadingItem,
  setShouldStop,
} from "../../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemSelector,
  currentScrollSelector,
  readingListLengthSelector,
  readingListSelector,
  shouldStopSelector,
} from "../../services/redux/VoiceOver/voiceOver.selectors";
import { styles } from "../../theme";
import { PauseIcon, PlayIcon } from "../../theme/images/voiceover";
import { ReadingItem } from "../../types/interface";
import { TextDSFR_MD_Bold, TextDSFR_XS, TextDSFR_XS_Med } from "../StyledText";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { logger } from "../../logger";
import { Reader, getTtsReader } from "../../libs/ttsReader";
import { debounce } from "lodash";

const Container = styled.View<{ bottomInset: number }>`
  position: absolute;
  bottom: ${({ bottomInset }) => bottomInset}px;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;
const PlayContainer = styled(TouchableOpacity)`
  width: 56px;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -28px;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;
const PlayButtonWrapper = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;
const PlayButton = styled.View<{ white: boolean }>`
  width: 54px;
  height: 54px;
  border-radius: 27px;
  z-index: 20;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, white }) =>
    white ? "white" : theme.colors.darkBlue};
  border: ${({ theme, white }) =>
    white ? `1px solid ${theme.colors.darkBlue}` : "none"};
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
const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const Space = styled.View`
  width: 56px;
  margin-right: 8px;
  margin-left: 8px;
`;
interface ButtonProps {
  mr?: boolean;
  ml?: boolean;
  background?: string;
}
const Button = styled(TouchableOpacity)<ButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) => props.background || "white"};
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => (props.mr ? "8px" : "0")};
  margin-left: ${(props) => (props.ml ? "8px" : "0")};
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
  offset: number = 0
) => {
  const toRead = list.filter((item) => item);
  if (toRead.length === 0) return [];
  const firstItemToRead = startFromId || toRead[0].id;
  const currentItemIndex = toRead.findIndex((i) => i.id === firstItemToRead);
  return toRead.slice(currentItemIndex + offset);
};

interface Props {
  bottomInset: number;
  white?: boolean;
  bold?: boolean;
}

export const ReadButton = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRTL();
  const { fontScale } = useWindowDimensions();

  const [isPaused, setIsPaused] = useState(false);
  const isStopped = useRef<boolean>(false);
  const isInstanceReading = useRef<boolean>(false);
  const [rate, setRate] = useState(1);
  const [resolvedReadingList, setResolvedReadingList] = useState<ReadingItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const scale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value, {
          mass: 0.5,
          damping: 14,
          stiffness: 200,
        }),
      },
    ],
  }));

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const readingList = useSelector(readingListSelector);
  const readingListLength = useSelector(readingListLengthSelector);
  const currentItem = useSelector(currentItemSelector);
  const currentScroll = useSelector(currentScrollSelector);

  const [isReading, setIsReading] = useState(false);
  useEffect(() => {
    setIsReading(!!currentItem);
  }, [currentItem]);

  const [reader, setReader] = useState<Reader | null>(null);
  /**
   * Recursively reads a list item by item
   * @param toRead
   * @param indexToRead
   * @returns
   */
  const readList = async (toRead: ReadingItem[], indexToRead: number = 0) => {
    if (toRead.length === 0) return;
    logger.info("Reading: ", toRead[indexToRead].text.slice(0, 30));
    // if reader stopped, do not continue reading
    if (isStopped.current) {
      isStopped.current = false; // reset isStopped
      return;
    }
    if (isPaused) setIsPaused(false);
    dispatch(setReadingItem(toRead[indexToRead]));

    setIsLoading(true);
    const newReader = await getTtsReader(
      // get reader
      toRead[indexToRead].text,
      currentLanguageI18nCode,
      rate
    );
    setReader(newReader);
    setIsLoading(false);
    isInstanceReading.current = true;
    await newReader.play(); // and start reading

    // if has been stopped before ending, no next
    if (isStopped.current) {
      isStopped.current = false; // reset isStopped
      return;
    }

    // read next or stop
    if (indexToRead === toRead.length - 1) {
      dispatch(setReadingItem(null));
    } else {
      readList(toRead, indexToRead + 1);
    }
  };

  // START
  const startToRead = useCallback(() => {
    if (readingList && readingListLength > 0) {
      setIsLoading(true);
      deactivateKeepAwake("voiceover").catch((e) => {
        logger.error(e);
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((e) => {
        logger.error(e);
      });

      logger.info("startToRead, nb items :", readingListLength);
      Promise.all(
        Object.values(readingList).map((r) =>
          r?.current?.getReadingItem(currentScroll)
        )
      )
        .then((res) => res.filter((r) => !!r) as ReadingItem[])
        .then((res) => {
          // logger.info("startToRead:: res", res);
          logEventInFirebase(FirebaseEvent.START_VOICEOVER, {
            locale: currentLanguageI18nCode,
          });
          const sortedReadingList = res.sort(sortItems);
          setResolvedReadingList(sortedReadingList);
          const scrollLimit = currentScroll === 0 ? 0 : currentScroll + 200; // arbitrary offset to select element in the middle of the screen is scrolled
          const firstItem = sortedReadingList.find(
            (item) => item.posY >= scrollLimit
          );
          const toRead = getReadingList(
            sortedReadingList,
            firstItem?.id || null
          );
          setIsLoading(false);
          readList(toRead);
        })
        .catch((e) => {
          logger.error(e);
        });
    }
  }, [readingList, currentScroll]);

  // NAVIGATE
  const goTo = (dir: "next" | "prev") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPaused(false);
    reader?.stop();
    isStopped.current = true;
    setTimeout(() => {
      // setTimeout to ensure it happens after previous readList resolve
      if (currentItem) {
        const toRead = getReadingList(
          resolvedReadingList,
          currentItem.id,
          dir === "next" ? 1 : -1
        );
        readList(toRead);
      }
    }, 100);
  };
  const debouncedNext = debounce(() => goTo("next"), 200);
  const debouncedPrev = debounce(() => goTo("prev"), 200);

  // STOP
  const stopVoiceOver = useCallback(() => {
    deactivateKeepAwake("voiceover");
    reader?.stop();
    if (isReading) {
      // test to prevent haptic on any navigate
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      isStopped.current = true;
    }
    dispatch(setReadingItem(null));
    setIsPaused(false);
    dispatch(setShouldStop(false));
  }, [isReading, reader]);

  // is screen loses focus and current instance was reading, stop it
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused && isReading && isInstanceReading.current === true) {
      isInstanceReading.current = false;
      stopVoiceOver();
    }
  }, [isFocused, stopVoiceOver]);

  // stopped by a component
  const shouldStop = useSelector(shouldStopSelector);
  useEffect(() => {
    if (shouldStop && isReading) {
      stopVoiceOver();
    }
  }, [shouldStop, stopVoiceOver]);

  // change language
  useEffect(() => {
    stopVoiceOver();
  }, [currentLanguageI18nCode]);

  // RATE
  const changeRate = () => {
    setRate((rate) => (rate === 1 ? MAX_RATE : 1));
  };
  useEffect(() => {
    if (!reader) return;
    if (reader.canChangeRate) {
      reader.setRate(rate);
    } else {
      setIsPaused(false);
      reader.stop();
      isStopped.current = true;
      // setTimeout to ensure it happens after previous readList resolve
      setTimeout(() => {
        if (currentItem) {
          const toRead = getReadingList(resolvedReadingList, currentItem.id);
          readList(toRead);
        }
      }, 100);
    }
  }, [rate]);

  // PAUSE
  const resumeReading = () => {
    if (currentItem) {
      const toRead = getReadingList(resolvedReadingList, currentItem.id);
      readList(toRead);
    }
  };
  useEffect(() => {
    if (isStopped.current) return;
    if (isPaused) {
      reader?.pause();
    } else {
      // pause and resume not available in android
      if (!reader?.canResume) {
        resumeReading();
      } else {
        reader?.resume();
      }
    }
  }, [isPaused]);

  // MENU
  useEffect(() => {
    scale.value = isReading ? 1 : 0;
  }, [isReading]);

  const toggleVoiceOver = () => {
    dispatch(setShouldStop(false));
    if (!isReading) {
      startToRead();
    } else {
      setIsPaused(!isPaused);
    }
  };

  const colors = useMemo(
    () => ({
      icon: props.white ? styles.colors.darkBlue : "#ffffff",
      text: props.white ? styles.colors.darkBlue : styles.colors.darkGrey,
    }),
    [props.white]
  );

  return (
    <Container bottomInset={props.bottomInset}>
      <PlayContainer
        onPress={toggleVoiceOver}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("tab_bar.listen", "Écouter")}
      >
        <PlayButtonWrapper>
          <PlayButton white={!!props.white}>
            {isLoading ? (
              <ActivityIndicator
                style={{ width: 20, height: 20 }}
                color={colors.icon}
              />
            ) : isReading && !isPaused ? (
              <PauseIcon size={20} color={colors.icon} />
            ) : (
              <PlayIcon size={20} color={colors.icon} />
            )}
          </PlayButton>
        </PlayButtonWrapper>
        {fontScale < 1.3 &&
          (props.bold ? (
            <TextDSFR_XS_Med style={{ color: colors.text }}>
              {t("tab_bar.listen", "Écouter")}
            </TextDSFR_XS_Med>
          ) : (
            <TextDSFR_XS style={{ color: colors.text }}>
              {t("tab_bar.listen", "Écouter")}
            </TextDSFR_XS>
          ))}
      </PlayContainer>
      <Buttons style={[animatedStyle]}>
        <BackgroundContainer>
          <Image
            source={require("../../theme/images/voiceover/bg_voiceover.png")}
            style={{ marginLeft: -8, marginTop: -8 }}
          />
        </BackgroundContainer>
        <Button onPress={changeRate}>
          <TextDSFR_MD_Bold>{rate === 1 ? "x1" : "x2"}</TextDSFR_MD_Bold>
        </Button>
        <Button onPress={debouncedPrev} ml>
          <Icon
            name={"arrow-back-outline"}
            height={24}
            width={24}
            fill={styles.colors.black}
          />
        </Button>
        <Space />
        <Button onPress={debouncedNext} mr>
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
