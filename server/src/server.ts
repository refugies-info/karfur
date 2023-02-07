"use strict";
require("dotenv").config();
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import { ValidateError } from "tsoa";
import cors from "cors";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import formData from "express-form-data";
import path from "path";
import compression from "compression";
import { errors } from "celebrate";
import { RegisterRoutes } from "../dist/routes";

import logger from "./logger";
import { AuthenticationError, NotFoundError } from "./errors";

const { NODE_ENV, CLOUD_NAME, API_KEY, API_SECRET, MONGODB_URI } = process.env;

logger.info(NODE_ENV + " environment");

//@ts-ignore
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const app = express();
// Database
mongoose.set("debug", false);
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
    extended: true
  })
);
app.use(formData.parse());
app.use(cors());

//Définition des CORS
app.use(function (_, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*" // process.env.FRONT_SITE_URL
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
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

// Setup routes
RegisterRoutes(app);

const userController = require(__dirname + "/controllers/userController");
const translateController = require(__dirname + "/controllers/translateController");
const languesController = require(__dirname + "/controllers/languesController");
const roleController = require(__dirname + "/controllers/roleController");
const imageController = require(__dirname + "/controllers/imageController");
const traductionController = require(__dirname + "/controllers/traductionController");
const dispositifController = require(__dirname + "/controllers/dispositifController");
const structureController = require(__dirname + "/controllers/structureController");
const ttsController = require(__dirname + "/controllers/ttsController");
const miscellaneousController = require(__dirname + "/controllers/miscellaneousController");
const indicatorController = require(__dirname + "/controllers/indicatorController");
const mailController = require(__dirname + "/controllers/mailController");
const needsController = require(__dirname + "/controllers/needsController");
const searchController = require(__dirname + "/controllers/searchController");
const widgetController = require(__dirname + "/controllers/widgetController");
const logController = require(__dirname + "/controllers/logController");
const appuserController = require(__dirname + "/controllers/appusersController");
const notificationsController = require(__dirname + "/controllers/notificationsController");
const adminOptionController = require(__dirname + "/controllers/adminOptionController");
const smsController = require(__dirname + "/controllers/smsController");

app.enable("strict routing");
app.use("/user", userController);
app.use("/translate", translateController);
app.use("/langues", languesController);
app.use("/roles", roleController);
app.use("/images", imageController);
app.use("/traduction", traductionController);
app.use("/dispositifs", dispositifController);
app.use("/structures", structureController);
app.use("/tts", ttsController);
app.use("/miscellaneous", miscellaneousController);
app.use("/indicator", indicatorController);
app.use("/mail", mailController);
app.use("/needs", needsController);
app.use("/search", searchController);
app.use("/logs", logController);
app.use("/widgets", widgetController);
app.use("/appuser", appuserController);
app.use("/notifications", notificationsController);
app.use("/options", adminOptionController);
app.use("/sms", smsController);

app.use(errors()); // Joi middleware for validation errors

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof AuthenticationError) {
    return res.status(403).json({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

  next();
});

var port = process.env.PORT;
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});
app.listen(port, () => logger.info(`Listening on port ${port}`));
