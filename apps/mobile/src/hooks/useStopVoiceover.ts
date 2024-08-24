import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setShouldStop } from "../services/redux/VoiceOver/voiceOver.actions";

export const useStopVoiceover = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(setShouldStop(true));
  }, []);
}