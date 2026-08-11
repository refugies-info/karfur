import { useEffect, useRef } from "react";
import { stopAudio } from "~/lib/readAudio";
import useLocale from "./useLocale";

/**
 * Stops any ongoing TTS playback when the locale changes.
 * The audio player is a singleton shared by every reader of the app,
 * so a language change must silence it wherever it was started from.
 * @param onStop called after the audio has been stopped, to let the caller reset its own UI state
 */
const useStopAudioOnLocaleChange = (onStop?: () => void) => {
  const locale = useLocale();
  const previousLocale = useRef(locale);
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  useEffect(() => {
    if (previousLocale.current === locale) return;
    previousLocale.current = locale;
    stopAudio();
    onStopRef.current?.();
  }, [locale]);
};

export default useStopAudioOnLocaleChange;
