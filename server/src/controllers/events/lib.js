const Event = require("../../schema/schemaEvent.js");
const User = require("../../schema/schemaUser.js");

function log_event(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.app) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    var event = req.body;
    event.userId = req.userId;
    // if(event.action){console.log(event)}
    var _u = new Event(event);
    _u.save((err, event) => {
      if (err) {
        res.status(500).json({
          text: "Erreur interne",
        });
      } else {
        res.status(200).json({
          text: "Succès",
          event: event,
        });
      }
    });
  }
}

function get_event(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  const { query, sort } = req.body;
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

function distinct_count_event(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  const body = req.body;
  Event.find(body.query)
    .distinct(body.distinct)
    .exec(function (err, data) {
      if (err) {
        res.status(500).json({ text: "Erreur interne" });
      } else if (!data) {
        res.status(404).json({ text: "Data not found" });
      } else {
        res.status(200).json({
          text: "Succès",
          data: data.length,
        });
      }
    });
}

async function distinct_event(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  const body = req.body;
  const query = body.query || {};
  Event.find(query)
    .distinct(body.distinct)
    .exec(async (err, data) => {
      if (err) {
        res.status(500).json({ text: "Erreur interne" });
      } else if (!data) {
        res.status(404).json({ text: "Data not found" });
      } else {
        if (body.distinct === "userId") {
          data = await User.find({}, { username: 1, status: 1, picture: 1 });
        }
        res.status(200).json({
          text: "Succès",
          data: data,
        });
      }
    });
}

function aggregate_events(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  var find = new Promise(function (resolve, reject) {
    Event.aggregate(req.body).exec(function (err, result) {
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

  find.then(
    function (result) {
      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    // eslint-disable-next-line no-use-before-define
    (e) => _errorHandler(e, res)
  );
}

const _errorHandler = (error, res) => {
  switch (error) {
    case 500:
      res.status(500).json({
        text: "Erreur interne",
        data: error,
      });
      break;
    case 404:
      res.status(404).json({
        text: "Pas de résultats",
        data: error,
      });
      break;
    default:
      res.status(500).json({
        text: "Erreur interne",
        data: error,
      });
  }
};

//On exporte notre fonction
exports.log_event = log_event;
exports.get_event = get_event;
exports.distinct_count_event = distinct_count_event;
exports.distinct_event = distinct_event;
exports.aggregate_events = aggregate_events;
