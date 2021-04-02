const { User } = require("../../schema/schemaUser");
const Role = require("../../schema/schemaRole.js");
const jwt = require("jwt-simple");
const logger = require("../../logger");
let config = {};
if (process.env.NODE_ENV === "dev") {
  config = require("../../config/config");
}

const check = (req, res, next) => {
  let token = req.headers["authorization"] || req.headers["x-access-token"];

  if (!token || token === null || token === undefined || token === "undefined")
    return res.status(403).send({ auth: false, message: "No token found." });

  let decoded = jwt.decode(
    token,
    process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET
  );

  if (
    !decoded ||
    decoded === null ||
    decoded === undefined ||
    decoded === "undefined"
  )
    return res.status(404).send({ auth: false, message: "No user found." });

  User.findById(decoded._id)
    .populate("roles")
    .exec(function (err, user) {
      if (err)
        return res.status(500).send({
          auth: false,
          message: "There was a problem finding the user.",
        });
      if (!user)
        return res.status(404).send({ auth: false, message: "No user found." });
      let userCopy = { ...user.toObject() };
      delete userCopy.password;
      req.userId = userCopy._id;
      req.user = userCopy;
      next();
    });
};

const getId = (req, res, next) => {
  let token = req.headers["authorization"] || req.headers["x-access-token"];

  req.userId = undefined;
  if (token !== null && token !== undefined && token !== "undefined") {
    let decoded = jwt.decode(
      token,
      process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET
    );
    if (decoded) {
      User.findById(decoded._id)
        .populate("roles")
        .exec(function (err, user) {
          if (err || !user) return;
          let userCopy = { ...user.toObject() };
          delete userCopy.password;
          req.userId = userCopy._id;
          req.user = userCopy;
          next();
        });
    } else {
      next();
    }
  } else {
    next();
  }
};

const getRoles = (req, res, next) => {
  Role.find({}).exec(function (err, roles) {
    if (err) {
      logger.error("error in getRoles", { error: err.message });
    }
    req.roles = roles;
    next();
  });
};

exports.check = check;
exports.getId = getId;
exports.getRoles = getRoles;
