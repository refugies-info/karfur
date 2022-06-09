import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  startReading,
  stopReading,
} from "../../services/redux/VoiceOver/voiceOver.actions";
import { isReadingSelector } from "../../services/redux/VoiceOver/voiceOver.selectors";
import { theme } from "../../theme";
import { StyledTextVerySmall } from "../StyledText";

const PlayContainer = styled(TouchableOpacity)`
  width: 56px;
  position: absolute;
  bottom: 4px;
  left: 50%;
  margin-left: -28px;
  align-items: center;
  justify-content: center;
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


export const ReadButton = () => {
  const dispatch = useDispatch();

  const isReading = useSelector(isReadingSelector);
  const toggleVoiceOver = () => {
    if (!isReading) {
      dispatch(startReading());
    } else {
      dispatch(stopReading());
    }
  };

  return (
    <PlayContainer
      onPress={toggleVoiceOver}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={"Écouter"}
    >
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
  );
};
