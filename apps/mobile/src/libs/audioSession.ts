import { setAudioModeAsync } from "expo-audio";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { logger } from "~/logger";

let audioModePromise: Promise<void> | null = null;

/**
 * Makes the voiceover audible even when the iOS mute switch is on, the same way a music or video
 * app behaves: the audio session goes to the `playback` category, which ignores the mute switch.
 *
 * Two libraries are configured because they own the session at different times:
 *
 * - `expo-audio` applies the category right away, even when nothing is playing (`AudioModule.swift`,
 *   `setAudioMode`). This is what makes `expo-speech` audible, since `AVSpeechSynthesizer` inherits
 *   the application session. `expo-av` cannot do it: its `_setAudioMode` (`EXAV.m`) only stores the
 *   flags and skips `setCategory` while no sound is playing.
 * - `expo-av` still drives the session while the Azure voices (`ps`/`fa`) play, and resets the
 *   category when it activates it, so it needs the same mode to avoid downgrading it.
 *
 * Android needs none of this: the TTS already goes through the media stream, which the ringer mode
 * does not mute. The options below only describe how we behave against other apps.
 */
export const enablePlaybackInSilentMode = (): Promise<void> => {
  if (!audioModePromise) {
    audioModePromise = Promise.all([
      setAudioModeAsync({
        playsInSilentMode: true,
        // reading over music would be unintelligible, so we pause the other app instead of ducking it
        interruptionMode: "doNotMix",
        interruptionModeAndroid: "doNotMix",
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
      }),
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
      }),
    ])
      .then(() => undefined)
      .catch((e) => {
        logger.error(e);
        audioModePromise = null; // let the next read try again
      });
  }
  return audioModePromise;
};
