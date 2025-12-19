import React from "react";
import { ScrollView } from "react-native";

const scrollToEnd = (el: React.RefObject<ScrollView | null>) => {
  return el.current?.scrollToEnd({ animated: false });
};
const scrollToStart = (el: React.RefObject<ScrollView | null>) => {
  return el.current?.scrollTo({ x: 0, y: 0, animated: false });
};

export const initHorizontalScroll = (
  elements: React.RefObject<ScrollView | null> | React.RefObject<ScrollView | null>[],
  isRTL: boolean,
) => {
  setTimeout(() => {
    if (isRTL) {
      if (Array.isArray(elements)) {
        for (const el of elements) scrollToEnd(el);
      } else {
        scrollToEnd(elements);
      }
    } else {
      if (Array.isArray(elements)) {
        for (const el of elements) scrollToStart(el);
      } else {
        scrollToStart(elements);
      }
    }
  });
};
