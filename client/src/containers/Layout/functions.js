import API from '../../utils/API';

const readAudio = function(text, locale='fr-fr', callback=()=>{}) {
  return API.get_tts({text:text, locale:locale}).then(data => {
    let audioData=data.data.data
    this.audio.pause();
    
    try{
      var len = audioData.length;
      var buf = new ArrayBuffer(len);
      var view = new Uint8Array(buf);
      for (var i = 0; i < len+10; i++) {
        view[i] = audioData.charCodeAt(i) & 0xff;
      }
      var blob = new Blob([view], {type: "audio/wav"});
      var url = window.URL.createObjectURL(blob)
      this.audio.src = url;
      this.audio.load();
      this.audio.play();
      this.audio.onended = function() {
        callback();
      };
      return true;
    }catch(e){
      console.log(e, audioData, url)
      return false;
    }
  })
}

export {readAudio}