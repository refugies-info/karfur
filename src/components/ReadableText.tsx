import React, { useEffect, useRef, useState, ReactNode } from "react";
import * as Speech from "expo-speech";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
  readNext,
} from "../services/redux/VoiceOver/voiceOver.actions";
import { currentItemId, isPausedSelector, readingRateSelector } from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
// import { wait } from "../libs/wait";
import { theme } from "../theme";
import { useIsFocused } from "@react-navigation/native";
import { logger } from "../logger";

interface Props {
  children?: string | ReactNode;
  text?: string;
}

export const ReadableText = (props: Props) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItemId);
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();

  const ref = useRef<View | null>(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        // use setTimeout to be sure the element has been rendered
        ref.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
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
  }, [isFocused]);

  const readingRate = useSelector(readingRateSelector);
  useEffect(() => {
    if (currentReadingItem === id) { // if currentItem is this one
      const text = props.text || props.children as string || "";
      Speech.speak(text, { // read it
        rate: readingRate,
        onBoundary: () => {
          logger.info("boundary");
        },
        onMark: () => {
          logger.info("mark");
        },
        onDone: () => {
          logger.info("done");
          dispatch(readNext());
          // wait(1000) // then wait for 1 sec
          //   .then(() => {}); // and go to next element
          //TODO: ERROR when go next -> fires anyway
        },
        onStopped: () => {

        }
      });
    }
  }, [currentReadingItem]);

  const isPaused = useSelector(isPausedSelector);
  useEffect(() => {
    if (currentReadingItem === id) { // if currentItem is this one
      if (isPaused) {
        Speech.pause();
      } else {
        Speech.resume();
      }
    };
  }, [isPaused]);

  const isActive = currentReadingItem === id;

  return (
    <>
      <Text
        style={isActive ? { backgroundColor: theme.colors.lightBlue} : {}}
      >
        {props.children}
      </Text>
      <View ref={ref}></View>
    </>
  );
};
