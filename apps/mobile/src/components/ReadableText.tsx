import { useIsFocused } from "@react-navigation/native";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { generateId } from "~/libs/generateId";
import { addToReadingList, removeFromReadingList } from "~/services/redux/VoiceOver/voiceOver.actions";
import { ReadingItem, ReadingObject } from "~/types/interface";
import { ReadableColoredText } from "./ReadableColoredText";

interface Props {
  children?: string | ReactNode;
  text?: string;
  // for accordions, element will be moved vertically when displayed
  heightOffset?: boolean;
  // for header elements, force position to 0 so they are not in the middle of a list if it's scrolled
  overridePosY?: number;
  // for carousel, override isFocused
  isFocused?: boolean;
  // if text is on dark background, change color
  darkBg?: boolean;
}

export const ReadableText = React.forwardRef((props: Props, ref: any) => {
  const dispatch = useDispatch();
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();

  if (ref) ref.current = id;
  const refView = useRef<View | null>(null);

  const text: string = useMemo(() => {
    return props.text || (props.children as string) || "";
  }, [props.text, props.children]);

  const elementFocused = props.isFocused !== undefined ? props.isFocused : isFocused;

  // Attach the properties/methods to the ref
  const readingObject = useRef<ReadingObject>();
  readingObject.current = {
    getReadingItem: (currentScroll: number) => {
      return new Promise((resolve) => {
        if (!refView.current || !elementFocused) {
          resolve(undefined);
          return;
        }
        refView.current.measureInWindow((x, y, _width, height) => {
          let posY = 0;

          if (props.overridePosY !== undefined) {
            posY = props.overridePosY;
          } else {
            posY = (!props.heightOffset ? y : y + height) + currentScroll;
          }
          // logger.info("Save position:", [posY.toFixed(0), text.slice(0, 20)]);
          resolve({
            id,
            text,
            posX: x,
            posY,
            ref: readingObject.current,
          } as ReadingItem);
        });
      });
    },
  } as ReadingObject;

  useEffect(() => {
    dispatch(addToReadingList({ item: readingObject, id }));

    () => {
      dispatch(removeFromReadingList(id));
    };
  }, []);

  return (
    <ReadableColoredText text={props.text} id={id} ref={refView} darkBg={props.darkBg}>
      {props.children}
    </ReadableColoredText>
  );
});

ReadableText.displayName = "ReadableText";
