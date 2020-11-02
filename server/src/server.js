"use strict";
require("dotenv").config();
//Définition des modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const formData = require("express-form-data");
const path = require("path");
const compression = require("compression");
const startup = require("./startup/startup");
// const scanner = require('./i18nscanner.js'); // Si besoin de lancer une extraction des strings manquantes en traduction

// var log = console.log;
// console.log = function() {
//     log.apply(console, arguments);
//     // Print the stack trace
//     console.trace();
// };

// const session = require('express-session');
// const sessionstore = require('sessionstore');

// const oauthLoginCallback = require('./controllers/account/france-connect').oauthLoginCallback
// const oauthLogoutCallback = require('./controllers/account/france-connect').oauthLogoutCallback
// const getUser = require('./controllers/account/france-connect').getUser

const {
  NODE_ENV,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
  MONGODB_PROD_URI,
  MONGODB_QA_URI,
} = process.env;

if (NODE_ENV === "dev") {
  // eslint-disable-next-line no-console
  console.log("dev environment");
} else {
  // eslint-disable-next-line no-console
  console.log(NODE_ENV + " environment");
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
//On définit notre objet express nommé app
const app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

//Connexion à la base de donnée
mongoose.set("debug", false);
let db_path =
  NODE_ENV === "dev"
    ? "mongodb://localhost/db"
    : NODE_ENV === "staging"
    ? MONGODB_QA_URI
    : MONGODB_PROD_URI;
// eslint-disable-next-line no-console
console.log("NODE_ENV : ", NODE_ENV);
mongoose
  .connect(db_path, { useNewUrlParser: true })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to mongoDB");
    startup.run(mongoose.connection.db); //A décommenter pour initialiser la base de données
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.log("Error while DB connecting", { error: e });
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Checking request origin
app.use(function (req, _, next) {
  req.fromSite =
    req.headers["site-secret"] === process.env.REACT_APP_SITE_SECRET;
  next();
});

//Définition du routeur
var router = express.Router();
app.enable("strict routing");
app.use("/user", router);
app.use("/events", router);
app.use("/translate", router);
app.use("/article", router);
app.use("/langues", router);
app.use("/roles", router);
app.use("/images", router);
app.use("/themes", router);
app.use("/traduction", router);
app.use("/dispositifs", router);
app.use("/structures", router);
app.use("/channels", router);
app.use("/tts", router);
app.use("/audio", router);
app.use("/webhook", router);
app.use("/miscellaneous", router);
app.use("/indicator", router);
require(__dirname + "/controllers/userController")(router);
require(__dirname + "/controllers/eventsController")(router);
require(__dirname + "/controllers/translateController")(router);
require(__dirname + "/controllers/articleController")(router);
require(__dirname + "/controllers/languesController")(router);
require(__dirname + "/controllers/roleController")(router);
require(__dirname + "/controllers/imageController")(router);
require(__dirname + "/controllers/themesController")(router);
require(__dirname + "/controllers/traductionController")(router);
require(__dirname + "/controllers/dispositifController")(router);
require(__dirname + "/controllers/structureController")(router);
require(__dirname + "/controllers/channelController")(router, io);
require(__dirname + "/controllers/ttsController")(router);
require(__dirname + "/messenger/controller")(router);
require(__dirname + "/controllers/audioController")(router);
require(__dirname + "/controllers/miscellaneousController")(router);
require(__dirname + "/controllers/indicatorController")(router);
// app.get('/login-callback', oauthLoginCallback);
// app.get('/logout-callback', oauthLogoutCallback);
// app.get('/user', getUser);

//Partie dédiée à la messagerie instantanée
io.on("connection", function (socket) {
  // eslint-disable-next-line no-console
  console.log("user connected");
  socket.on("subscribeToChat", function () {
    // eslint-disable-next-line no-console
    console.log("user subscribed");
  });
  socket.on("client:sendMessage", function (msg) {
    if (msg && msg.data && msg.data.text) {
      // eslint-disable-next-line no-console
      console.log("message utilisateur : " + msg.data.text);
    }
    io.emit("MessageSent", msg);
  });
  socket.on("agent:sendMessage", function (msg) {
    if (msg && msg.data && msg.data.text) {
      // eslint-disable-next-line no-console
      console.log("message agent : " + msg.data.text);
    }
    io.emit("MessageSent", msg);
  });
  socket.on("disconnect", function () {
    // eslint-disable-next-line no-console
    console.log("user disconnected");
  });
});

//Définition et mise en place du port d'écoute
var ioport = process.env.PORTIO;
// eslint-disable-next-line no-use-before-define, no-console
io.listen(ioport, () => console.log(`Listening on port ${port}`));
var port = process.env.PORT;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
