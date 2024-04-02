import * as Speech from "expo-speech";
import { AVPlaybackStatusSuccess, Audio } from "expo-av";
import ReactNativeBlobUtil from "react-native-blob-util";
import { fetchAudio } from "../utils/API";
import { Platform } from "react-native";
import { logger } from "../logger";

export interface Reader {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  canResume: boolean;
}

// wait for a sound to finish playing
const waitForDiJustFinishedPlaying = (sound: Audio.Sound) =>
  new Promise((resolve) => {
    sound.setOnPlaybackStatusUpdate(
      //@ts-ignore
      (playbackStatus: AVPlaybackStatusSuccess) => {
        if (playbackStatus.didJustFinish) resolve(null);
      }
    );
  });

/**
 * Returns reader using Microsoft Azure TTS
 * @param text - text to read
 * @param language - language to use
 * @param rate - voice reading speed
 * @returns reader
 */
const getAzureReader = async (
  text: string,
  language: string | null,
  rate: number
): Promise<Reader> => {
  const path = await fetchAudio({
    text: text,
    locale: language || "fr",
  });
  const { sound } = await Audio.Sound.createAsync(
    { uri: `file://${path}` },
    {
      progressUpdateIntervalMillis: 10,
      rate
    }
  );

  return {
    play: () =>
      new Promise((resolve) => {
        waitForDiJustFinishedPlaying(sound).then(() => {
          ReactNativeBlobUtil.fs.unlink(path); // clean the cache when done playing the file, it is not done automatically
          resolve();
        });
        sound.playAsync();
      }),
    stop: () => sound.stopAsync(),
    pause: () => sound.pauseAsync(),
    resume: () => sound.playAsync(),
    canResume: true
  };
}

/**
 * Returns reader based on native phone TTS capabilities
 * @param text - text to read
 * @param language - language to use
 * @param rate - voice reading speed
 * @returns reader
 */
const getNativeReader = (
  text: string,
  language: string | null,
  rate: number
): Reader => ({
  play: () =>
    new Promise((resolve) => {
      Speech.speak(text, {
        rate: rate,
        language: language || "fr",
        onDone: () => {
          resolve();
        },
      });
    }),
  stop: () => Speech.stop(),
  pause: () => {
    if (Platform.OS === "android") {
      Speech.stop();
    } else {
      Speech.pause()
    }
  },
  resume: () => {
    if (Platform.OS === "android") {
      logger.error("Resume not implemented in Android")
    } else {
      Speech.resume();
    }
  },
  canResume: false
})

const needsAzureTts = (language: string | null) => {
  if (!language) return false; // default FR
  if (Platform.OS === "android") return ["ps", "fa"].includes(language)
  return ["ps"].includes(language)
}

/**
 * Returns a TTS reader
 * @param text - text to read
 * @param language - language to use
 * @param rate - voice reading speed
 * @returns reader
 */
export const getTtsReader = async (
  text: string,
  language: string | null,
  rate: number
): Promise<Reader> => needsAzureTts(language) ?
    getAzureReader(text, language, rate) :
    getNativeReader(text, language, rate);

