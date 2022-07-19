import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList
} from "../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemSelector,
} from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
import { theme } from "../theme";
import { useIsFocused } from "@react-navigation/native";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { ReadingItem } from "../types/interface";

interface Props {
  children?: string | ReactNode;
  text?: string;
   // for accordions, element will be moved vertically when displayed
  heightOffset?: boolean;
}

export const ReadableText = React.forwardRef((props: Props, ref: any) => {
  const dispatch = useDispatch();
  const currentReadingItem = useSelector(currentItemSelector);
  const [id, _setId] = useState(generateId());
  const isFocused = useIsFocused();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  if (ref) ref.current = id;
  const refView = useRef<View | null>(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        const item: Promise<ReadingItem> = new Promise(resolve => {
          refView.current?.measure((_x, _y, _width, height, pageX, pageY) => {
            resolve({
              id: id,
              text: props.text || (props.children as string) || "",
              posX: pageX,
              posY: !props.heightOffset ? pageY : pageY + height
            } as ReadingItem)
          });
        });
        dispatch(addToReadingList(item));
      })
    }
  }, [isFocused, currentLanguageI18nCode]);

  const isActive = currentReadingItem?.id === id;
  return (
    props.text ? ( // if text given as prop, include content in a View
      <View
        ref={refView}
        style={isActive ? { backgroundColor: theme.colors.lightBlue, flexDirection: "row" } : { flexDirection: "row" }}
        collapsable={false}
      >
        {props.children}
      </View>
    ) : ( // else, include content in a Text
      <>
        <Text
          style={isActive ? { backgroundColor: theme.colors.lightBlue } : {}}>
          {props.children}
        </Text>
        <View ref={refView}></View>
      </>
    )
  );
});

ReadableText.displayName = "ReadableText";
