import React, { useEffect, useRef, useState, ReactNode, useMemo } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
  editReadingListItem,
} from "../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemSelector,
  currentScrollSelector,
  readingListLengthSelector,
} from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
import { styles } from "../theme";
import { useIsFocused } from "@react-navigation/native";
import { ReadingItem } from "../types/interface";
import { logger } from "../logger";

interface Props {
  children?: string | ReactNode;
  text?: string;
  // for accordions, element will be moved vertically when displayed
  heightOffset?: boolean;
  // for header elements, force position to 0 so they are not in the middle of a list if it's scrolled
  overridePosY?: number;
}

const getItem = (
  text: string,
  overridePosY: number | undefined,
  heightOffset: boolean | undefined,
  ref: React.MutableRefObject<View | null>,
  currentScroll: number,
  id: string
): Promise<ReadingItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      ref.current?.measureInWindow((x, y, _width, height) => {
        let posY = 0;

        if (overridePosY !== undefined) {
          posY = overridePosY;
        } else {
          posY = (!heightOffset ? y : y + height) + currentScroll;
        }
        // logger.info("Save position:", [posY.toFixed(0), text.slice(0, 20)]);
        resolve({
          id,
          text,
          posX: x,
          posY,
        } as ReadingItem);
      });
    });
  });
};

export const ReadableText = React.forwardRef((props: Props, ref: any) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItemSelector);
  const readingListLength = useSelector(readingListLengthSelector);
  const currentScroll = useSelector(currentScrollSelector);
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();

  if (ref) ref.current = id;
  const refView = useRef<View | null>(null);

  const text: string = useMemo(() => {
    return props.text || (props.children as string) || "";
  }, [props.text, props.children]);

  useEffect(() => {
    if (isFocused && readingListLength === 0) {
      const item: Promise<ReadingItem> = getItem(
        text,
        props.overridePosY,
        props.heightOffset,
        refView,
        currentScroll,
        id
      );
      dispatch(addToReadingList({ item, id }));
    }
  }, [readingListLength]);

  useEffect(() => {
    if (isFocused && text) {
      const item: Promise<ReadingItem> = getItem(
        text,
        props.overridePosY,
        props.heightOffset,
        refView,
        currentScroll,
        id
      );
      dispatch(editReadingListItem({ item, id }));
    }
  }, [text]);

  const isActive = currentReadingItem?.id === id;
  return props.text ? ( // if text given as prop, include content in a View
    <View
      ref={refView}
      style={
        isActive
          ? { backgroundColor: styles.colors.lightBlue, maxWidth: "100%" }
          : { maxWidth: "100%" }
      }
      collapsable={false}
    >
      {props.children}
    </View>
  ) : (
    // else, include content in a Text
    <>
      <Text
        style={isActive ? { backgroundColor: styles.colors.lightBlue } : {}}
      >
        {props.children}
      </Text>
      <View ref={refView}></View>
    </>
  );
});

ReadableText.displayName = "ReadableText";
