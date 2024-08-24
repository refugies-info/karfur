import React from "react";
import { ScrollView } from "react-native";

const scrollToEnd = (el: React.RefObject<ScrollView>) => {
  return el.current?.scrollToEnd({ animated: false });
}
const scrollToStart = (el: React.RefObject<ScrollView>) => {
  return el.current?.scrollTo({ x: 0, y: 0, animated: false });
}

export const initHorizontalScroll = (
  elements: React.RefObject<ScrollView> | React.RefObject<ScrollView>[],
  isRTL: boolean
) => {
  setTimeout(() => {
    if (isRTL) {
      if (Array.isArray(elements)) {
        for (let el of elements) scrollToEnd(el);
      } else {
        scrollToEnd(elements);
      }
    } else {
      if (Array.isArray(elements)) {
        for (let el of elements) scrollToStart(el);
      } else {
        scrollToStart(elements);
      }
    }
  });
};
