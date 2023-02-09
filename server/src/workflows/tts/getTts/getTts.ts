import fetch from "node-fetch";
import xmlbuilder from "xmlbuilder";
import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { TtsParams } from "../../../controllers/ttsController";
import { AuthenticationError } from "../../../errors";
import voices from "../../../controllers/tts/voices";

export interface Tts {

}
/* TODO: test */
const getAccessToken = async (subscriptionKey: string) => {
  const response = await fetch("https://francecentral.api.cognitive.microsoft.com/sts/v1.0/issuetoken", {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": subscriptionKey, }
  });
  return response.json();
}

/* TODO: test */
export const getTts = async (body: TtsParams): ResponseWithData<Tts> => {
  logger.info("[getTts] received", body);

  const subscriptionKey = process.env.TTS_KEY_1;
  const accessToken = await getAccessToken(subscriptionKey);
  if (!accessToken) {
    throw new AuthenticationError("Invalid token");
  }

  // Make sure to update User-Agent with the name of your resource.
  // You can also change the voice and output formats. See:
  // https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
  const reader =
    (voices.data.find((x) => x.locale === body.locale) || {}).name ||
    "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)";
  // Create the SSML request.
  const xml_body = xmlbuilder
    .create("speak")
    .att("version", "1.0")
    .att("xml:lang", body.locale)
    .ele("voice")
    .att("xml:lang", body.locale)
    .att("name", reader)
    .txt(body.text)
    .end();

  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "User-Agent": "MicrosoftTTS",
      "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
      "Content-Type": "application/ssml+xml",
    },
    encoding: "latin1",
    body: xml_body.toString()// Convert the XML into a string to send in the TTS request.
  };

  try {
    const response = await fetch("https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1", options);
    return {
      text: "success",
      data: response
    }
  } catch (e) {
    throw new Error(e.message)
  }
};

