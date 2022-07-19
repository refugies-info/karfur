import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import { Platform, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import {
  setReadingItem
} from "../../services/redux/VoiceOver/voiceOver.actions";
import { currentItemSelector, currentScrollSelector, readingListSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { theme } from "../../theme";
import Background from "../../theme/images/voiceover/bg_voiceover.svg";
import Pause from "../../theme/images/voiceover/pause_icon.svg";
import Play from "../../theme/images/voiceover/play_icon.svg";
import { ReadingItem } from "../../types/interface";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";

const Container = styled(View)`
  position: absolute;
  bottom: ${((props: {bottomInset: number}) => props.bottomInset)}px;
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
`;
const PlayButton = styled(View)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${theme.colors.darkBlue};
  z-index: 20;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(4, 33, 177, 0.16);
`;
const Buttons = styled(View)`
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
  mr?: boolean
  ml?: boolean
  background?: string
}
const Button = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props: ButtonProps) => props.background || "white"};
  justify-content: center;
  align-items:center;
  margin-right: ${(props: ButtonProps) => props.mr ? "8px" : "0"};
  margin-left: ${(props: ButtonProps) => props.ml ? "8px" : "0"};
  ${theme.shadows.blue}
`;

const MAX_RATE = Platform.OS === "android" ? 1.4 : 1.2;

const sortItems = (a: ReadingItem, b: ReadingItem) => {
  if (a.posY < b.posY) return -1;
  else if (a.posY > b.posY) return 1;
  else if (a.posX < b.posX) -1; // is same horizontal position, check vertical position
  return 1;
}

interface Props {
  bottomInset: number
}

export const ReadButton = (props: Props) => {
  const dispatch = useDispatch();

  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const readingList = useSelector(readingListSelector);
  const currentItem = useSelector(currentItemSelector);
  const currentScroll = useSelector(currentScrollSelector);

  const getReadingList = useCallback((startFromId: string | null, offset: number) => {
    const toRead = readingList.sort(sortItems).filter(item => item);
    const firstItemToRead = startFromId || toRead[0].id;
    const currentItemIndex = toRead.findIndex(i => i.id === firstItemToRead);
    return toRead.slice(currentItemIndex + offset);
  }, [readingList]);

  const readText = useCallback((item: ReadingItem, readingList: ReadingItem[]) => {
    Speech.speak(item.text, {
      rate: rate,
      language: currentLanguageI18nCode || "fr",
      onStart: () => { dispatch(setReadingItem(item.id)) },
      onDone: () => {
        if (readingList[readingList.length - 1].id === item.id) {
          dispatch(setReadingItem(null))
        }
      }
    });
  }, [rate, currentLanguageI18nCode]);

  const startToRead = () => {
    activateKeepAwake("voiceover");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const sortedReadingList = readingList.sort(sortItems);
    const firstItem = sortedReadingList.find(item => item.posY >= currentScroll);
    const toRead = getReadingList(firstItem?.id || null, 0);
    for (const item of toRead) readText(item, toRead);
  }

  const goToNext = () => {
    Speech.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, 1);
      for (const item of toRead) readText(item, toRead);
    }
  }

  const goToPrevious = () => {
    Speech.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, -1);
      for (const item of toRead) readText(item, toRead);
    }
  }

  const stopVoiceOver = () => {
    deactivateKeepAwake("voiceover");
    Speech.stop();
    dispatch(setReadingItem(null));
    if (currentItem) { // test to prevent haptic on any navigate
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  const changeRate = () => {
    setRate(rate => rate === 1 ? MAX_RATE : 1);
  }

  // Navigate to other screen
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      stopVoiceOver();
    });

    return unsubscribe;
  }, [navigation]);

  // change rate
  useEffect(() => {
    Speech.stop();
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, 0);
      for (const item of toRead) readText(item, toRead);
    }
  }, [rate])

  // change language
  useEffect(() => {
    stopVoiceOver();
  }, [currentLanguageI18nCode])

  const toggleVoiceOver = () => {
    if (!currentItem) {
      startToRead();
    } else {
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    if (isPaused) {
      if (Platform.OS === "android") {
        Speech.stop();
      } else {
        Speech.pause();
      }
    } else {
      if (Platform.OS === "android") {
        if (currentItem) startToRead();
      } else {
        Speech.resume();
      }
    }
  }, [isPaused]);

  return (
    <Container bottomInset={props.bottomInset}>
      <PlayContainer
        onPress={toggleVoiceOver}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={"Écouter"}>
        <PlayButton>
          {(currentItem && !isPaused) ?
            <Pause width={16} height={16} /> :
            <Play width={16} height={16} />
          }
        </PlayButton>
        <StyledTextVerySmall style={{ color: theme.colors.darkGrey }}>
          Écouter
        </StyledTextVerySmall>
      </PlayContainer>
      {currentItem && (
        <Buttons>
          <BackgroundContainer>
            <Background />
          </BackgroundContainer>
          <Button onPress={changeRate}>
            <StyledTextSmallBold>
              {rate === 1 ? "x1" : "x2"}
            </StyledTextSmallBold>
          </Button>
          <Button onPress={goToPrevious} ml>
            <Icon
              name={"arrow-back-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
          <Space />
          <Button onPress={goToNext} mr>
            <Icon
              name={"arrow-forward-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
          <Button onPress={stopVoiceOver} background={theme.colors.red}>
            <Icon
              name={"close-outline"}
              height={24}
              width={24}
              fill={theme.colors.white}
            />
          </Button>
        </Buttons>
      )}
    </Container>
  );
};
