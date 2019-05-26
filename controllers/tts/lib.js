require('dotenv').config();

// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');
const voices = require('./voices').data;

// Gets an access token.
let subscriptionKey, accessToken;
function getAccessToken(subscriptionKey) {
  console.log('getting access token')
  let options = {
      method: 'POST',
      uri: ' https://francecentral.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
      headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
      }
  }
  return rp(options);
}

// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text, locale='fr-fr') {
  reader=(voices.find(x=>x.locale===locale) || {}).name || "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)"

  // Create the SSML request.
  let xml_body = xmlbuilder.create('speak')
      .att('version', '1.0')
      .att('xml:lang', locale)
      .ele('voice')
      .att('xml:lang', locale)
      .att('name', reader)
      .txt(text)
      .end();
  // Convert the XML into a string to send in the TTS request.
  let body = xml_body.toString();

  let options = {
      method: 'POST',
      baseUrl: 'https://francecentral.tts.speech.microsoft.com/',
      url: 'cognitiveservices/v1',
      headers: {
          'Authorization': 'Bearer ' + accessToken,
          'cache-control': 'no-cache',
          'User-Agent': 'MicrosoftTTS',
          'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
          'Content-Type': 'application/ssml+xml'
      },
      encoding: 'latin1',
      body: body
  }
  return options;
}

var ll=0;
async function get_tts(req, res) {
  console.log(req.body)
  if (!req.body || !req.body.text) {
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    var text = req.body.text;
    var locale = req.body.locale;
    
    subscriptionKey = process.env.TTS_KEY_1;
    accessToken = await getAccessToken(subscriptionKey);
    if(!accessToken){
      res.status(402).json({
        "text": "Token invalide"
      })
      return false;
    }
    let options = textToSpeech(accessToken, text, locale);

    rp(options, function (error, response, body) {
      if(error){console.error('error:', error);} // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      if (response && response.statusCode === 200) {
        res.status(200).json({
          "text": "Succès",
          "data": body
        })
        // res.writeHead(200, { 'Content-Type': 'audio/wav',
        //   "Content-Length": body.length});
        // console.log(body.length)
        // res.end(body)
      }else{console.log(response.statusCode)}
    });
    // let request = rp(options).on('response', (response) => {
    //     if (response.statusCode === 200) {
    //       //console.log(response)
    //       //res.end(response, 'utf-8');
    //       ll++;
    //       request.pipe(fs.createWriteStream(__dirname + '/TTSOutput' + ll + '.wav'));
    //       // console.log('\nYour file is ready.\n')
    //     }
    // });
  }
}

//On exporte notre fonction
exports.get_tts = get_tts;