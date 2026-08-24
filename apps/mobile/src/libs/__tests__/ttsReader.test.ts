jest.mock("~/utils/API", () => ({
  fetchAudio: jest.fn().mockResolvedValue("/tmp/audio.mp3"),
}));

jest.mock("react-native-blob-util", () => ({
  fs: { unlink: jest.fn() },
}));

/**
 * `audioSession` memoizes the audio mode in a module variable, so each test needs a fresh module
 * registry — and therefore a fresh set of mocks from the same registry.
 */
const loadTtsReader = () => {
  let getTtsReader!: typeof import("../ttsReader").getTtsReader;
  let Audio!: typeof import("expo-av").Audio;
  let ExpoAudio!: typeof import("expo-audio");
  let Speech!: typeof import("expo-speech");

  jest.isolateModules(() => {
    getTtsReader = require("../ttsReader").getTtsReader;
    Audio = require("expo-av").Audio;
    ExpoAudio = require("expo-audio");
    Speech = require("expo-speech");
  });

  return {
    getTtsReader,
    createAsync: Audio.Sound.createAsync as jest.Mock,
    setAvAudioMode: Audio.setAudioModeAsync as jest.Mock,
    setAudioMode: ExpoAudio.setAudioModeAsync as jest.Mock,
    speak: Speech.speak as jest.Mock,
  };
};

describe("getTtsReader", () => {
  it("makes the audio session ignore the iOS mute switch", async () => {
    const { getTtsReader, setAudioMode } = loadTtsReader();

    await getTtsReader("bonjour", "fr", 1);

    // expo-audio is the one that applies the category while nothing is playing, which is what makes
    // expo-speech audible with the mute switch on
    expect(setAudioMode).toHaveBeenCalledWith(expect.objectContaining({ playsInSilentMode: true }));
  });

  it("keeps expo-av on the same mode, so the Azure sound does not downgrade the category", async () => {
    const { getTtsReader, setAvAudioMode } = loadTtsReader();

    await getTtsReader("bonjour", "fr", 1);

    expect(setAvAudioMode).toHaveBeenCalledWith(
      expect.objectContaining({ playsInSilentModeIOS: true }),
    );
  });

  it("configures the audio session before the native reader speaks", async () => {
    const { getTtsReader, setAudioMode, speak } = loadTtsReader();

    const reader = await getTtsReader("bonjour", "fr", 1);
    await reader.play();

    expect(setAudioMode).toHaveBeenCalled();
    expect(setAudioMode.mock.invocationCallOrder[0]).toBeLessThan(
      speak.mock.invocationCallOrder[0],
    );
  });

  it("lets the native reader reuse the application audio session", async () => {
    const { getTtsReader, speak } = loadTtsReader();

    const reader = await getTtsReader("bonjour", "fr", 1);
    await reader.play();

    expect(speak).toHaveBeenCalledWith(
      "bonjour",
      expect.objectContaining({ useApplicationAudioSession: true }),
    );
  });

  it("configures the audio session for the Azure reader too", async () => {
    const { getTtsReader, setAudioMode, createAsync } = loadTtsReader();

    await getTtsReader("سلام", "ps", 1);

    expect(setAudioMode).toHaveBeenCalledWith(expect.objectContaining({ playsInSilentMode: true }));
    expect(createAsync).toHaveBeenCalled();
  });

  it("only configures the audio session once per app run", async () => {
    const { getTtsReader, setAudioMode, setAvAudioMode } = loadTtsReader();

    await getTtsReader("bonjour", "fr", 1);
    await getTtsReader("bonsoir", "fr", 1);

    expect(setAudioMode).toHaveBeenCalledTimes(1);
    expect(setAvAudioMode).toHaveBeenCalledTimes(1);
  });
});
