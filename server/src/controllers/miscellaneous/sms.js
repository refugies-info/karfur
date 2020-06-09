const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);

function send_sms(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  const { number, typeContenu, title, url } = req.body;
  console.log(number, typeContenu, title, url);
  if (!number || !url) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  client.messages
    .create({
      from: "+33757902900",
      body:
        "Bonjour\nVoici le lien vers " +
        (typeContenu === "demarche" ? "la démarche" : "le dispositif") +
        " ''" +
        title +
        "' : " +
        url,
      to: number,
    })
    .then((message) =>
      res.status(200).json({ text: "Message envoyé", sid: message.sid })
    )
    .catch((e) => res.status(404).json({ text: "Erreur interne", data: e }));
}

exports.send_sms = send_sms;
