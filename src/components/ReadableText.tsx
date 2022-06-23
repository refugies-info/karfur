import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
} from "../services/redux/VoiceOver/voiceOver.actions";
import {
  currentItemId,
} from "../services/redux/VoiceOver/voiceOver.selectors";
import { generateId } from "../libs/generateId";
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
        const text = props.text || (props.children as string) || "";
        // use setTimeout to be sure the element has been rendered
        refView.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
          dispatch(
            addToReadingList({
              id: id,
              posX: pageX,
              posY: pageY,
              text: text
            })
          );
        });
      });
    }
  }, [isFocused, currentLanguageI18nCode]);

  const isActive = currentReadingItem === id;
  return (
    <>
      {props.text ? ( // if text given as prop, include content in a View
        <View
          ref={refView}
          style={isActive ? { backgroundColor: theme.colors.lightBlue, flexDirection: "row" } : { flexDirection: "row" }}
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
      )}
    </>
  );
});

ReadableText.displayName = "ReadableText";
