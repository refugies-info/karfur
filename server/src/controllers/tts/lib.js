require("dotenv").config();
// TODO: delete
// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require("request-promise");
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require("xmlbuilder");
const voices = require("./voices").data;

// Gets an access token.
let subscriptionKey, accessToken;
function getAccessToken(subscriptionKey) {
  const options = {
    method: "POST",
    uri: " https://francecentral.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  return rp(options);
}

// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text, locale = "fr-fr") {
  const reader =
    (voices.find((x) => x.locale === locale) || {}).name ||
    "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)";
  // Create the SSML request.
  let xml_body = xmlbuilder
    .create("speak")
    .att("version", "1.0")
    .att("xml:lang", locale)
    .ele("voice")
    .att("xml:lang", locale)
    .att("name", reader)
    .txt(text)
    .end();
  // Convert the XML into a string to send in the TTS request.
  let body = xml_body.toString();

  const options = {
    method: "POST",
    baseUrl: "https://francecentral.tts.speech.microsoft.com/",
    url: "cognitiveservices/v1",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "cache-control": "no-cache",
      "User-Agent": "MicrosoftTTS",
      "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
      "Content-Type": "application/ssml+xml"
    },
    encoding: "latin1",
    body: body
  };
  return options;
}

async function get_tts(req, res) {
  if (!req.body || !req.body.text) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    var text = req.body.text;
    var locale = req.body.locale;

    subscriptionKey = process.env.TTS_KEY_1;
    accessToken = await getAccessToken(subscriptionKey);
    if (!accessToken) {
      res.status(402).json({ text: "Token invalide" });
      return false;
    }
    let options = textToSpeech(accessToken, text, locale);

    rp(options, function (error, response, body) {
      if (error) {
        return res.status(500).json({
          text: "Erreur interne",
          data: error
        });
      } // Print the error if one occurred
      if (response && response.statusCode === 200) {
        res.status(200).json({
          text: "Succès",
          data: body
        });
      }
    });
  }
}

//On exporte notre fonction
exports.get_tts = get_tts;
