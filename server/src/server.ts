"use strict";
require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import formData from "express-form-data";
import path from "path";
import compression from "compression";
import { errors } from "celebrate";
import { RegisterRoutes } from "../dist/routes";
import logger from "./logger";
import { serverErrorHandler } from "./errors";

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
mongoose.set("debug", true);
mongoose.set("strictQuery", true);
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
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);
app.use(formData.parse());
app.use(cors());

//Définition des CORS
app.use(function (_, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*", // process.env.FRONT_SITE_URL
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

//Checking request origin
// TODO: delete
app.use(function (req, _, next) {
  //@ts-ignore
  req.fromPostman = req.headers["postman-secret"] === process.env.POSTMAN_SECRET;
  //@ts-ignore
  req.fromSite = req.headers["site-secret"] === process.env.REACT_APP_SITE_SECRET;
  next();
});

// Setup routes
RegisterRoutes(app);

const traductionController = require(__dirname + "/controllers/traductionController");
const dispositifController = require(__dirname + "/controllers/dispositifController");
const structureController = require(__dirname + "/controllers/structureController");

app.enable("strict routing");
app.use("/traduction", traductionController.router);
app.use("/dispositifs", dispositifController.router);
app.use("/structures", structureController.router);

app.use(errors()); // TODO: delete and use tsoa instead

app.use(serverErrorHandler);

var port = process.env.PORT;
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});
app.listen(port, () => logger.info(`Listening on port ${port}`));
