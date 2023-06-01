import API from "utils/API";

let audio: HTMLAudioElement | null;
if (typeof Audio !== "undefined") {
  // for browsers
  audio = new Audio();
}

const BASE_RATE = 0.75;

const readAudio = function (
  text: string,
  locale: string = "fr-fr",
  callback: any = null,
  isActive: boolean = true,
  startLoader: any = () => { },
) {
  if (!text || text === "null") return;
  startLoader(true);
  API.cancel_tts_subscription();
  return API.getTts({ text, locale })
    .then((audioData) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;

      try {
        var blob = new Blob([audioData], { type: "audio/wav" });
        var blobUrl = window.URL.createObjectURL(blob);
        audio.src = blobUrl;
        audio.onended = function () {
          callback && callback();
        };
        //On ne le joue que si l'audio est toujours activé
        if (isActive) {
          audio.load();
          audio.playbackRate = BASE_RATE;
          audio.play().catch(() => { });
        }
        startLoader(false);
        return true;
      } catch (e) {
        startLoader(false);
        return false;
      }
    })
    .catch(() => { });
};

const stopAudio = function () {
  if (!audio) return;
  API.cancel_tts_subscription();
  audio.pause();
  audio.currentTime = 0;
};

const pauseAudio = function () {
  if (!audio) return;
  audio.pause();
};

const resumeAudio = function () {
  if (!audio) return;
  audio.play();
};

const changeRate = function (rate: 1 | 2) {
  if (!audio) return;
  const customRate = rate === 2 ? 1.15 : BASE_RATE;
  audio.playbackRate = customRate;
};

export { readAudio, stopAudio, pauseAudio, resumeAudio, changeRate };
