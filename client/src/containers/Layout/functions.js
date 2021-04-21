import API from "../../utils/API";

const readAudio = function (
  text,
  locale = "fr-fr",
  callback = null,
  inDispositif = false
) {
  if (!text || text === "null") return true;
  !inDispositif && this.props.toggleSpinner(true);
  API.cancel_tts_subscription();
  return API.get_tts({ text, locale })
    .then((data) => {
      let audioData = data.data.data;
      this.audio.pause();
      this.audio.currentTime = 0;

      try {
        var len = audioData.length;
        var buf = new ArrayBuffer(len);
        var view = new Uint8Array(buf);
        for (var i = 0; i < len + 10; i++) {
          view[i] = audioData.charCodeAt(i) & 0xff;
        }
        var blob = new Blob([view], { type: "audio/wav" });
        var url = window.URL.createObjectURL(blob);
        this.audio.src = url;
        this.audio.onended = function () {
          callback && callback();
        };
        //On ne le joue que si l'audio est toujours activé
        if (this.props.ttsActive || inDispositif) {
          this.audio.load();
          this.audio.play().catch(() => {});
        }
        !inDispositif && this.props.toggleSpinner(false);
        return true;
      } catch (e) {
        !inDispositif && this.props.toggleSpinner(false);
        return false;
      }
    })
    .catch(() => {});
};

export { readAudio };
