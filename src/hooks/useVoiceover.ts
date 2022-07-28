import { useIsFocused } from "@react-navigation/native";
import { MutableRefObject, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { newReadingList, setScrollReading } from "../services/redux/VoiceOver/voiceOver.actions";
import { currentItemSelector, readingListSelector } from "../services/redux/VoiceOver/voiceOver.selectors";

export const useVoiceover = (
  scrollviewRef: MutableRefObject<ScrollView | null>,
  offset: number
): {
  setScroll: (currentScroll: number, offset: number) => void,
  saveList: () => void
} => {
  const dispatch = useDispatch();

  // When screen focused, create a new readingList if none available
  const isFocused = useIsFocused();
  const [registeringStarted, setRegisteringStarted] = useState(false);
  const [oldPosY, setOldPosY] = useState(0);
  const readingList = useSelector(readingListSelector);

  useEffect(() => {
    if (isFocused) {
      setRegisteringStarted(true);
      if (!registeringStarted && !Array.isArray(readingList)) {
        dispatch(newReadingList(oldPosY));
      }
    } else {
      setRegisteringStarted(false);
    }
  }, [isFocused]);


  // Auto scrolls to current item
  const currentReadingItem = useSelector(currentItemSelector);

  useEffect(() => {
    if (scrollviewRef && currentReadingItem) {
      scrollviewRef.current?.scrollTo({
        // item.posY is position on page. So offset needs to be equal position of 1rst element on page
        y: currentReadingItem.posY - offset,
        animated: true
      })
    }
  }, [currentReadingItem]);

  // Save scroll locally in component, and in Redux
  const setScroll = (currentScroll: number, offset: number) => {
    setOldPosY(currentScroll);
    dispatch(setScrollReading(currentScroll + offset))
  }

  // Manually saves list
  const saveList = () => {
    dispatch(newReadingList(oldPosY));
  }

  return { setScroll, saveList };
}