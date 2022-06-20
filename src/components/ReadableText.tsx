import React, { useEffect, useRef, useState, ReactNode } from "react";
import * as Speech from "expo-speech";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
  readNext
} from "../services/redux/VoiceOver/voiceOver.actions";
import { currentItemId, isPausedSelector, readingRateSelector } from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
// import { wait } from "../libs/wait";
import { theme } from "../theme";
import { useIsFocused } from "@react-navigation/native";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";

interface Props {
  children?: string | ReactNode;
  text?: string;
}

export const ReadableText = React.forwardRef((props: Props, ref: any) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItemId);
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  if (ref) ref.current = id;
  const refView = useRef<View | null>(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        // use setTimeout to be sure the element has been rendered
        refView.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
          dispatch(
            addToReadingList({
              id: id,
              posX: pageX,
              posY: pageY,
            })
          );
        });
      });
    }
  }, [isFocused, currentLanguageI18nCode]);

  const readingRate = useSelector(readingRateSelector);
  const isPaused = useSelector(isPausedSelector);
  useEffect(() => {
    if (currentReadingItem === id && !isPaused) { // if currentItem is this one
      const text = props.text || props.children as string || "";
      Speech.stop();
      Speech.speak(text, { // read it
        rate: readingRate,
        language: currentLanguageI18nCode || "fr",
        onDone: () => {
          Speech.isSpeakingAsync().then(res => {
            if (!res) dispatch(readNext());
          })
          // wait(1000) // then wait for 1 sec
          //   .then(() => {}); // and go to next element
          //TODO: ERROR when go next -> fires anyway
        },
        onStopped: () => {

        }
      });
    }
  }, [currentReadingItem, isPaused]);


  const isActive = currentReadingItem === id;

  return (
    <>
      <Text
        style={isActive ? { backgroundColor: theme.colors.lightBlue } : {}}
      >
        {props.children}
      </Text>
      <View ref={refView}></View>
    </>
  );
});

ReadableText.displayName = "ReadableText";