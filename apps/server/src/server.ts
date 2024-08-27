"use strict";
require("dotenv").config();
import cloudinary from "cloudinary";
import compression from "compression";
import cors from "cors";
import express from "express";
import formData from "express-form-data";
import mongoose from "mongoose";
import { serverErrorHandler } from "~/errors";
import logger from "~/logger";
import { RegisterRoutes } from "../dist/routes";

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

const connectWithRetry = async () => {
  return mongoose
    .connect(db_path)
    .then(() => logger.info("[mongoose] Connected to mongoDB"))
    .catch((e) => {
      logger.error("[mongoose] Error while DB connecting. Retrying in 5 seconds...", { message: e.message, error: e });
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry().catch((e) => logger.error("[mongoose] error", { error: e }));

//Body Parser
app.use(compression());
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

// Setup routes
RegisterRoutes(app);
app.enable("strict routing");
app.use(serverErrorHandler);

app.get("*", (_req, res) => {
  res.status(404).json({ message: "Not found" });
});
const port = process.env.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`));
