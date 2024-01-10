import { useIsFocused } from "@react-navigation/native";
import { MutableRefObject, useEffect } from "react";
import { ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setScrollReading } from "../services/redux/VoiceOver/voiceOver.actions";
import { currentItemSelector } from "../services/redux/VoiceOver/voiceOver.selectors";

export const useVoiceover = (
  scrollviewRef: MutableRefObject<ScrollView | FlatList | null>,
  offset: number
): { setScroll: (currentScroll: number, offset: number) => void } => {
  const dispatch = useDispatch();

  // When screen focused, create a new readingList if none available
  const isFocused = useIsFocused();
  // Auto scrolls to current item
  const currentReadingItem = useSelector(currentItemSelector);
  useEffect(() => {
    if (scrollviewRef?.current && currentReadingItem) {
      const current = (scrollviewRef.current as FlatList).getNativeScrollRef
        ? (scrollviewRef.current as FlatList).getNativeScrollRef() as ScrollView // can be a FlatList
        : scrollviewRef.current as ScrollView; // or a ScrollView
      current.scrollTo({
        // item.posY is position on page. So offset needs to be equal position of 1rst element on page
        y: currentReadingItem.posY - offset,
        animated: true,
      });
    }
  }, [currentReadingItem]);

  // Save scroll locally in component, and in Redux
  const setScroll = (currentScroll: number, _offset: number) => {
    if (isFocused) {
      dispatch(setScrollReading(currentScroll));
    }
  };

  return { setScroll };
};
