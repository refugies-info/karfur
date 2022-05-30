"use strict";
require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import formData from "express-form-data";
import path from "path";
import compression from "compression";
import logger from "./logger";

const { NODE_ENV, CLOUD_NAME, API_KEY, API_SECRET, MONGODB_URI } = process.env;

logger.info(NODE_ENV + " environment");

//@ts-ignore
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const app = express();
// Database
mongoose.set("debug", false);
const db_path = MONGODB_URI;
mongoose
  .connect(db_path)
  .then(() => {
    logger.info("Connected to mongoDB");
  })
  .catch((e) => {
    logger.error("Error while DB connecting", { error: e.message });
  });

//Body Parser
app.use(compression());
app.use(express.static(path.join(__dirname, "../../client", "build")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
  limit: "50mb",
  extended: true,
}));
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
    "*" // process.env.FRONT_SITE_URL
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

//Checking request origin
app.use(function (req, _, next) {
  //@ts-ignore
  req.fromPostman = req.headers["postman-secret"] === process.env.POSTMAN_SECRET;
  //@ts-ignore
  req.fromSite = req.headers["site-secret"] === process.env.REACT_APP_SITE_SECRET;
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
app.use("/search", router);
app.use("/logs", router);
app.use("/widgets", router);

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
require(__dirname + "/controllers/searchController")(router);
require(__dirname + "/controllers/logController")(router);
require(__dirname + "/controllers/widgetController")(router);

var port = process.env.PORT;
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});
app.listen(port, () => logger.info(`Listening on port ${port}`));
