var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.airtableBase
);

function set_mail(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body.mail) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  const mail = req.body.mail;
  base("Mailing liste Agi'r").create(
    [{ fields: { Mail: mail } }],
    function (err, records) {
      if (err) {
        res.status(500).json({ text: "Erreur interne" });
        return;
      }
      res.status(200).json({
        text: "Succès",
        data: records,
      });
    }
  );
}

exports.set_mail = set_mail;
