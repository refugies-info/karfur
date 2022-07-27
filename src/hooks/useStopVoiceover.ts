import { deactivateKeepAwake } from "expo-keep-awake";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import * as Speech from "expo-speech";
import { setReadingItem } from "../services/redux/VoiceOver/voiceOver.actions";

export const useStopVoiceover = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    deactivateKeepAwake("voiceover");
    Speech.stop();
    dispatch(setReadingItem(null));
  }, []);
}