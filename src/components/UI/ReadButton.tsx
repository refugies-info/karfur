import React, { useCallback, useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import * as Speech from "expo-speech";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  pauseReading,
  resumeReading,
  setReadingItem,
} from "../../services/redux/VoiceOver/voiceOver.actions";
import { currentItemSelector, currentScrollSelector, isPausedSelector, readingListSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { theme } from "../../theme";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";
import Play from "../../theme/images/voiceover/play_icon.svg";
import Pause from "../../theme/images/voiceover/pause_icon.svg";
import Background from "../../theme/images/voiceover/bg_voiceover.svg";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { ReadingItem } from "../../types/interface";

const Container = styled(View)`
  position: absolute;
  bottom: 0;
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
`;

const sortItems = (a: ReadingItem, b: ReadingItem) => {
  if (a.posY < b.posY) return -1;
  else if (a.posY > b.posY) return 1;
  else if (a.posX < b.posX) -1; // is same horizontal position, check vertical position
  return 1;
}

export const ReadButton = () => {
  const dispatch = useDispatch();

  const isPaused = useSelector(isPausedSelector);
  const [rate, setRate] = useState(1);


  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const readingList = useSelector(readingListSelector);
  const currentItem = useSelector(currentItemSelector);
  const currentScroll = useSelector(currentScrollSelector);

  const getReadingList = useCallback((startFromId: string | null, offset: number) => {
    const toRead = readingList.sort(sortItems);
    const firstItemToRead = startFromId || toRead[0].id;
    const currentItemIndex = toRead.findIndex(i => i.id === firstItemToRead);
    return toRead.slice(currentItemIndex + offset);
  }, [readingList]);

  const readText = useCallback((item: ReadingItem) => {
    Speech.speak(item.text, {
      rate: rate,
      language: currentLanguageI18nCode || "fr",
      onStart: () => { dispatch(setReadingItem(item.id)) }
    });
  }, [rate, currentLanguageI18nCode]);

  const startToRead = () => {
    const sortedReadingList = readingList.sort(sortItems);
    const firstItem = sortedReadingList.find(item => item.posY >= currentScroll);
    const toRead = getReadingList(firstItem?.id || null, 0);
    for (const item of toRead) readText(item);
  }

  const goToNext = () => {
    Speech.stop();
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, 1);
      for (const item of toRead) readText(item);
    }
  }

  const goToPrevious = () => {
    Speech.stop();
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, -1);
      for (const item of toRead) readText(item);
    }
  }

  const stopVoiceOver = () => {
    Speech.stop();
    dispatch(setReadingItem(null));
  }

  const changeRate = () => {
    setRate(rate => rate === 1 ? 1.2 : 1);
  }

  useEffect(() => {
    Speech.stop();
    if (currentItem) {
      const toRead = getReadingList(currentItem.id, 0);
      for (const item of toRead) readText(item);
    }
  }, [rate])

  const toggleVoiceOver = () => {
    if (!currentItem) {
      startToRead();
    } else if (isPaused) {
      dispatch(resumeReading());
    } else {
      dispatch(pauseReading());
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
    <Container>
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
