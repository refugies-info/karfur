const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);

function whatsapp_post(req, res) {
  res.sendStatus(200);
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: "Hello, there!",
      to: "whatsapp:+33617118026",
    })
    .then((message) => console.log(message.sid));
}

exports.whatsapp_post = whatsapp_post;
