var castArray = require("lodash.castarray");
var isEmpty = require("lodash.isempty");
const request = require("request");

const callAPI = (endPoint, messageDataArray, queryParams = {}, retries = 5) => {
  // Error if developer forgot to specify an endpoint to send our request to
  if (!endPoint) {
    return;
  }

  // Error if we've run out of retries.
  if (retries < 0) {
    return;
  }

  const PAGE_ACCESS_TOKEN =
    "EAAERWNWISMwBAHlNu34wEpDh70UkpQwwufMsr8RV8qMAhKxRCPZBuKKIZBvrZBoJVpZC42dB3e8sD2L2h3tZBDmIxZC3rjX3iAb5qYt3BM1JwDG26C9PEe8orW0ZAraessVGxVPTzMaBWJWrGlTZBHDu3YZAA7KXfg7clNZBi2ZC6NEOwZDZD";
  // ensure query parameters have a PAGE_ACCESS_TOKEN value
  /* eslint-disable camelcase */
  const query = Object.assign({ access_token: PAGE_ACCESS_TOKEN }, queryParams);
  /* eslint-enable camelcase */

  // ready the first message in the array for send.
  const [messageToSend, ...queue] = castArray(messageDataArray);
  request(
    {
      uri: `https://graph.facebook.com/v3.2/me/${endPoint}`,
      qs: query,
      method: "POST",
      json: messageToSend,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Message has been successfully received by Facebook.

        // Continue sending payloads until queue empty.
        if (!isEmpty(queue)) {
          callAPI(endPoint, queue, queryParams);
        }
      } else {
        // Message has not been successfully received by Facebook.
        // eslint-disable-next-line no-console
        console.error(
          `Failed calling Messenger API endpoint ${endPoint}`,
          response.statusCode,
          response.statusMessage,
          body.error,
          queryParams
        );

        // Retry the request
        // eslint-disable-next-line no-console
        console.error(`Retrying Request: ${retries} left`);
        callAPI(endPoint, messageDataArray, queryParams, retries - 1);
      }
    }
  );
};
const callMessagesAPI = (messageDataArray, queryParams = {}) => {
  return callAPI("messages", messageDataArray, queryParams);
};

const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_on", // eslint-disable-line camelcase
  };
};

const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_off", // eslint-disable-line camelcase
  };
};

const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads).map((messagePayload) =>
    messageToJSON(recipientId, messagePayload)
  );

  callMessagesAPI([
    typingOn(recipientId),
    ...messagePayloadArray,
    typingOff(recipientId),
  ]);
};

const pushMessage = (event) => {
  const url = (event.optin || {}).ref;
  const senderId = event.sender.id;

  if (url) {
    const setRedirectButton = {
      type: "web_url",
      title: "Karfu'R, un projet de la DIAIR",
      // eslint-disable-next-line quotes
      url: `https://agir-dev.herokuapp.com` + url,
      webview_height_ratio: "tall",
      messenger_extensions: true,
    };

    const pushMessage = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text:
            "Bonjour et bienvenue dans le projet Karfu'R. Cliquez sur le bouton ci-dessous pour accéder au lien demandé",
          buttons: [setRedirectButton],
        },
      },
    };

    sendMessage(senderId, pushMessage);
  }
};

const setPreferencesButton = {
  type: "web_url",
  title: "Karfu'R, un projet de la DIAIR",
  // eslint-disable-next-line quotes
  url: `https://agir-dev.herokuapp.com/`,
  webview_height_ratio: "tall",
  messenger_extensions: true,
};

const helloRewardMessage = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text:
        "Bonjour et bienvenue dans le projet Karfu'R. Cliquez sur le bouton ci-dessous pour accéder à notre site",
      buttons: [setPreferencesButton],
    },
  },
};
const sendHelloRewardMessage = (recipientId) => {
  sendMessage(recipientId, helloRewardMessage);
};

const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  if (message.text) {
    sendHelloRewardMessage(senderId);
  }
};

function post(req, res) {
  res.sendStatus(200);
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (pageEntry) {
      if (!pageEntry.messaging) {
        return;
      }
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          handleReceiveMessage(messagingEvent);
        } else if (messagingEvent.optin) {
          pushMessage(messagingEvent);
        }
      });
    });
  }
}

// function get(req, res) {
//   console.log('oust')
// res.status(200)
// // Your verify token. Should be a random string.
// let VERIFY_TOKEN = "trucmuchebidule"

// // Parse the query params
// let mode = req.query['hub.mode'];
// let token = req.query['hub.verify_token'];
// let challenge = req.query['hub.challenge'];

// // Checks if a token and mode is in the query string of the request
// if (mode && token) {

//   // Checks the mode and token sent is correct
//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {

//     // Responds with the challenge token from the request
//     console.log('WEBHOOK_VERIFIED');
//     res.status(200).send(challenge);

//   } else {
//     // Responds with '403 Forbidden' if verify tokens do not match
//     res.sendStatus(403);
//   }
// }
// };

//On exporte notre fonction
exports.post = post;
// exports.get = get;
