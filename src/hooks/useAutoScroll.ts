import { MutableRefObject, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { currentItem } from "../services/redux/VoiceOver/voiceOver.selectors";

export const useAutoScroll = (
  scrollviewRef: MutableRefObject<ScrollView | null>,
  offset: number
) => {
  const currentReadingItem = useSelector(currentItem);
  useEffect(() => {
    if (scrollviewRef && currentReadingItem) {
      scrollviewRef.current?.scrollTo({
        y: currentReadingItem.posY - offset,
        animated: true
      })
    }
  }, [currentReadingItem]);
}