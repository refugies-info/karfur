import API from "utils/API";

let audio: HTMLAudioElement | null;
if (typeof Audio !== "undefined") { // for browsers
  audio = new Audio();
}

const readAudio = function (
  text: string,
  locale: string = "fr-fr",
  callback: any = null,
  inDispositif: boolean = false,
  isActive: boolean = true,
  startLoader: any = () => { }
) {
  if (!text || text === "null") return;
  !inDispositif && startLoader(true);
  API.cancel_tts_subscription();
  return API.getTts({ text, locale })
    .then((data) => {
      if (!audio) return;
      const audioData = data.data.data;
      audio.pause();
      audio.currentTime = 0;

      try {
        var len = audioData.length;
        var buf = new ArrayBuffer(len);
        var view = new Uint8Array(buf);
        for (var i = 0; i < len + 10; i++) {
          view[i] = audioData.charCodeAt(i) & 0xff;
        }
        var blob = new Blob([view], { type: "audio/wav" });
        //@ts-ignore
        var url = window.URL.createObjectURL(blob);
        audio.src = url;
        audio.onended = function () {
          callback && callback();
        };
        //On ne le joue que si l'audio est toujours activé
        if (isActive || inDispositif) {
          audio.load();
          audio.play().catch(() => { });
        }
        !inDispositif && startLoader(false);
        return true;
      } catch (e) {
        !inDispositif && startLoader(false);
        return false;
      }
    })
    .catch(() => { });
};

const stopAudio = function () {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};

export { readAudio, stopAudio };
