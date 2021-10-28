"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const formData = require("express-form-data");
const path = require("path");
const compression = require("compression");
const logger = require("./logger");

const { NODE_ENV, CLOUD_NAME, API_KEY, API_SECRET, MONGODB_URI } = process.env;

logger.info(NODE_ENV + " environment");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
//On définit notre objet express nommé app
const app = express();

//Connexion à la base de donnée
mongoose.set("debug", false);
let db_path = MONGODB_URI;

mongoose
  .connect(db_path, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info("Connected to mongoDB");
  })
  .catch((e) => {
    logger.error("Error while DB connecting", { error: e.message });
  });

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: "50mb",
});
app.use(compression());
app.use(express.static(path.join(__dirname, "../../client", "build")));
app.use(urlencodedParser);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(formData.parse());
app.use(cors());

//Définition des CORS
app.use(function (_, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONT_SITE_URL
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Checking request origin
app.use(function (req, _, next) {
  req.fromPostman =
    req.headers["postman-secret"] === process.env.POSTMAN_SECRET;
  req.fromSite =
    req.headers["site-secret"] === process.env.REACT_APP_SITE_SECRET;
  next();
});

//Définition du routeur
var router = express.Router();
app.enable("strict routing");
app.use("/user", router);
app.use("/translate", router);
app.use("/langues", router);
app.use("/roles", router);
app.use("/images", router);
app.use("/traduction", router);
app.use("/dispositifs", router);
app.use("/structures", router);
app.use("/tts", router);
app.use("/miscellaneous", router);
app.use("/indicator", router);
app.use("/mail", router);
app.use("/needs", router);
require(__dirname + "/controllers/userController")(router);
require(__dirname + "/controllers/translateController")(router);
require(__dirname + "/controllers/languesController")(router);
require(__dirname + "/controllers/roleController")(router);
require(__dirname + "/controllers/imageController")(router);
require(__dirname + "/controllers/traductionController")(router);
require(__dirname + "/controllers/dispositifController")(router);
require(__dirname + "/controllers/structureController")(router);
require(__dirname + "/controllers/ttsController")(router);
require(__dirname + "/controllers/miscellaneousController")(router);
require(__dirname + "/controllers/indicatorController")(router);
require(__dirname + "/controllers/mailController")(router);
require(__dirname + "/controllers/needsController")(router);

var port = process.env.PORT;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});
app.listen(port, () => logger.info(`Listening on port ${port}`));
