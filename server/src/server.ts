"use strict";
require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import formData from "express-form-data";
import compression from "compression";
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

const connectWithRetry = async () => {
  return mongoose
    .connect(db_path)
    .then(() => logger.info("[mongoose] Connected to mongoDB"))
    .catch((e) => {
      logger.error("[mongoose] Error while DB connecting. Retrying in 5 seconds...", { message: e.message, error: e });
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry().catch(e => logger.error("[mongoose] error", { error: e }));

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

// app.get("*", (_req, res) => {
//   res.status(404).json({ message: "Not found" });
// });


// Comment this after you test
app.get("/error", (_req, _res, _next) => {
  // Create a new Error object
  throw new Error("Intentional 500 Error");
});


// Middleware to Handle 404 Route error
app.use((_req, res,) => {
  res.status(404).send({ "message": "Not Found" });
});

// Middleware to handle 500 errors
app.use((err: any, _req: any, res: any, next: any) => {

  res.status(500).send({ "message": "Something broke!", error: err.message });
  next();
});
const port = process.env.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`));
