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
        // item.posY is position on page. So offset needs to be equal position of 1rst element on page
        y: currentReadingItem.posY - offset,
        animated: true
      })
    }
  }, [currentReadingItem]);
}