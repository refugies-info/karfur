import logger from "../../../logger";
import { TtsRequest } from "api-types";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { SpeechSynthesisOutputFormat } from "microsoft-cognitiveservices-speech-sdk";
import voices from "./voices";

const { PassThrough } = require("stream");

export const getTts = async (body: TtsRequest): Promise<any> => {
  logger.info("[getTts] received", body);
  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.TTS_KEY_1, "francecentral");
    speechConfig.speechSynthesisLanguage = body.locale || "fr-FR"; // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = voices[body.locale];
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

    let synthesizer = new sdk.SpeechSynthesizer(speechConfig); // Create the speech synthesizer.
    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        body.text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            logger.info("[getTts] synthesis finished.");
          } else {
            logger.error(
              "[getTts] Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you set the speech resource key and region values?",
            );
            reject(result.errorDetails);
            return;
          }
          const { audioData } = result;
          synthesizer.close();
          synthesizer = null;
          const bufferStream = new PassThrough();
          bufferStream.end(Buffer.from(audioData));
          resolve(bufferStream);
        },
        (err) => {
          logger.error("[getTts]", err);
          synthesizer.close();
          synthesizer = null;
          reject(err);
        },
      );
    });
  } catch (e) {
    throw new Error(e.message);
  }
};
