import React, { useEffect, useRef, useState, ReactNode } from "react";
import * as Speech from "expo-speech";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
  readNext,
} from "../services/redux/VoiceOver/voiceOver.actions";
import { currentItem } from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
import { wait } from "../libs/wait";
import { theme } from "../theme";
import { useIsFocused } from "@react-navigation/native";

interface Props {
  children?: string | ReactNode;
  text?: string;
}

export const ReadableText = (props: Props) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItem);
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

  useEffect(() => {
    if (currentReadingItem === id) { // if currentItem is this one
      const text = props.text || props.children as string || "";
      Speech.speak(text, { // read it
        onDone: () => {
          wait(1000) // then wait for 1 sec
            .then(() => dispatch(readNext())); // and go to next element
        }
      });
    }
  }, [currentReadingItem]);

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
