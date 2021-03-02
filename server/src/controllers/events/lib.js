const Event = require("../../schema/schemaEvent.js");
const { User } = require("../../schema/schemaUser");
const logger = require("../../logger");

function get_event(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }

  const { query, sort } = req.body;
  logger.info("get_event", query);
  var findEvent = new Promise(function (resolve, reject) {
    Event.find(query)
      .sort(sort)
      .exec(function (err, result) {
        if (err) {
          reject(500);
        } else {
          if (result) {
            resolve(result);
          } else {
            reject(404);
          }
        }
      });
  });

  findEvent.then(
    function (result) {
      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    function () {
      res.status(500).json({ text: "Erreur interne" });
    }
  );
}

//On exporte notre fonction
exports.get_event = get_event;
