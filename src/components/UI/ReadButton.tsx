import React, { useEffect } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import * as Speech from "expo-speech";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  pauseReading,
  readNext,
  readPrevious,
  readRate,
  resumeReading,
  startReading,
  stopReading,
} from "../../services/redux/VoiceOver/voiceOver.actions";
import { isPausedSelector, isReadingSelector, readingRateSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { theme } from "../../theme";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";
import Play from "../../theme/images/voiceover/play_icon.svg";
import Pause from "../../theme/images/voiceover/pause_icon.svg";
import Background from "../../theme/images/voiceover/bg_voiceover.svg";

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

export const ReadButton = () => {
  const dispatch = useDispatch();

  const isReading = useSelector(isReadingSelector);
  const isPaused = useSelector(isPausedSelector);
  const rate = useSelector(readingRateSelector);
  const toggleVoiceOver = () => {
    if (!isReading) {
      dispatch(startReading());
    } else if (isPaused) {
      dispatch(resumeReading());
    } else {
      dispatch(pauseReading());
    }
  };

  const goToNext = () => {
    dispatch(readNext());
  }

  const goToPrevious = () => {
    dispatch(readPrevious());
  }

  const stopVoiceOver = () => {
    Speech.stop();
    dispatch(stopReading());
  }

  const changeRate = () => {
    dispatch(readRate());
  }

  useEffect(() => {
    if (isPaused) {
      if (Platform.OS === "android") {
        Speech.stop();
      } else {
        Speech.pause();
      }
    } else {
      if (Platform.OS === "android") {
        dispatch(startReading());
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
          {(isReading && !isPaused) ?
            <Pause width={16} height={16} /> :
            <Play width={16} height={16} />
          }
        </PlayButton>
        <StyledTextVerySmall style={{ color: theme.colors.darkGrey }}>
          Écouter
        </StyledTextVerySmall>
      </PlayContainer>
      {isReading && (
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
