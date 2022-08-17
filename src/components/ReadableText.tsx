import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToReadingList } from "../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemSelector,
  currentScrollSelector,
  readingListLengthSelector,
} from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
import { styles } from "../theme";
import { useIsFocused } from "@react-navigation/native";
import { ReadingItem } from "../types/interface";

interface Props {
  children?: string | ReactNode;
  text?: string;
  // for accordions, element will be moved vertically when displayed
  heightOffset?: boolean;
  // for header elements, force position to 0 so they are not in the middle of a list if it's scrolled
  overridePosY?: number;
}

export const ReadableText = React.forwardRef((props: Props, ref: any) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItemSelector);
  const readingListLength = useSelector(readingListLengthSelector);
  const currentScroll = useSelector(currentScrollSelector);
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();

  if (ref) ref.current = id;
  const refView = useRef<View | null>(null);

  useEffect(() => {
    if (readingListLength === 0 && isFocused) {
      const item: Promise<ReadingItem> = new Promise((resolve) => {
        setTimeout(() => {
          refView.current?.measureInWindow((x, y, _width, height) => {
            let posY = 0;
            if (props.overridePosY !== undefined) {
              posY = props.overridePosY;
            } else {
              posY = (!props.heightOffset ? y : y + height) + currentScroll;
            }

            resolve({
              id: id,
              text: props.text || (props.children as string) || "",
              posX: x,
              posY,
            } as ReadingItem);
          });
        });
      });
      dispatch(addToReadingList(item));
    }
  }, [readingListLength]);

  const isActive = currentReadingItem?.id === id;
  return props.text ? ( // if text given as prop, include content in a View
    <View
      ref={refView}
      style={
        isActive
          ? { backgroundColor: styles.colors.lightBlue, maxWidth: "100%" }
          : { maxWidth: "100%" }
      }
      collapsable={false}>
      {props.children}
    </View>
  ) : (
    // else, include content in a Text
    <>
      <Text style={isActive ? { backgroundColor: styles.colors.lightBlue } : {}}>
        {props.children}
      </Text>
      <View ref={refView}></View>
    </>
  );
});

ReadableText.displayName = "ReadableText";
