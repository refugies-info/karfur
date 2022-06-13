import React from "react";
import { TouchableOpacity, View } from "react-native";
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
import { isPausedSelector, isReadingSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { theme } from "../../theme";
import { StyledTextVerySmall } from "../StyledText";

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
  background: ${theme.colors.lightBlue};
  flex-direction: row;
  display: flex;
  position: absolute;
  bottom: 49px;
  z-index: 1;
`;
const Space = styled(View)`
  width: 56px;
  margin-right: 10px;
  margin-left: 10px;
`;
const Button = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin: 8px;
  background: white;
  justify-content: center;
  align-items:center;
`;

export const ReadButton = () => {
  const dispatch = useDispatch();

  const isReading = useSelector(isReadingSelector);
  const isPaused = useSelector(isPausedSelector);
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
    Speech.stop();
    dispatch(readNext());
  }

  const goToPrevious = () => {
    Speech.stop();
    dispatch(readPrevious());
  }

  const stopVoiceOver = () => {
    Speech.stop();
    dispatch(stopReading());
  }

  const changeRate = () => {
    dispatch(readRate());
  }

  return (
    <Container>
      <PlayContainer
        onPress={toggleVoiceOver}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={"Écouter"}>
        <PlayButton>
          <Icon
            name={isReading ? "square-outline" : "arrow-right"}
            height={24}
            width={24}
            fill={theme.colors.white}
          />
        </PlayButton>
        <StyledTextVerySmall style={{ color: theme.colors.darkGrey }}>
          Écouter
        </StyledTextVerySmall>
      </PlayContainer>
      {isReading && (
        <Buttons>
          <Button onPress={changeRate}>
            <Icon
              name={"flash-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
          <Button onPress={goToPrevious}>
            <Icon
              name={"arrow-back-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
          <Space />
          <Button onPress={goToNext}>
            <Icon
              name={"arrow-forward-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
          <Button onPress={stopVoiceOver}>
            <Icon
              name={"close-outline"}
              height={24}
              width={24}
              fill={theme.colors.black}
            />
          </Button>
        </Buttons>
      )}
    </Container>
  );
};
