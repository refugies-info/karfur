'use strict';
require('dotenv').config();
//Définition des modules
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const path = require("path");
const compression = require('compression');
const startup = require('./startup/startup');
// const scanner = require('./i18nscanner.js'); // Si besoin de lancer une extraction des strings manquantes en traduction

// const session = require('express-session');
// const sessionstore = require('sessionstore');

// const oauthLoginCallback = require('./controllers/account/france-connect').oauthLoginCallback
// const oauthLogoutCallback = require('./controllers/account/france-connect').oauthLogoutCallback
// const getUser = require('./controllers/account/france-connect').getUser

const {NODE_ENV, CLOUD_NAME, API_KEY, API_SECRET, DB_CONN, DB_USER, DB_PW, MONGODB_URI} = process.env;

let scraper;
if(NODE_ENV === 'dev') {
  console.log('dev environment')
  //scraper = require('./scraper/puppeter');
} else{
  console.log(NODE_ENV + ' environment')
}

cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: API_KEY, 
  api_secret: API_SECRET
})

//On définit notre objet express nommé app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Connexion à la base de donnée
mongoose.set('debug', false);
let auth = null;
let db_path = NODE_ENV === 'dev' ? 'mongodb://localhost/db' : MONGODB_URI;

// let db_path = DB_CONN;
// auth = {user: DB_USER, password: DB_PW};
mongoose.connect(db_path, { ...(auth && {auth: auth}), useNewUrlParser: true }).then(() => {
  console.log('Connected to mongoDB');
  startup.run(mongoose.connection.db); //A décommenter pour initialiser la base de données
}).catch(e => {
  console.log('Error while DB connecting');
  console.log(e);
});

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
});
app.use(compression());
app.use(express.static(path.join(__dirname, "client", "build")))
app.use(urlencodedParser);
app.use(bodyParser.json({limit: '50mb'}));
app.use(formData.parse());
app.use(cors());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Note this enable to store user session in memory
// As a consequence, restarting the node process will wipe all sessions data
// app.use(session({
//   store: sessionstore.createSessionStore(),
//   secret: 'demo secret', // put your own secret
//   cookie: {},
//   saveUninitialized: true,
//   resave: true,
// }));

// app.use((req, res, next) => {
//   res.locals.user = req.session.user;
//   res.locals.data = req.session.data;
//   next();
// });

//Définition du routeur
var router = express.Router();
app.enable("strict routing")
app.use('/user', router);
app.use('/events', router);
app.use('/translate', router);
app.use('/article', router);
app.use('/langues', router);
app.use('/roles', router);
app.use('/images', router);
app.use('/themes', router);
app.use('/traduction', router);
app.use('/dispositifs', router);
app.use('/structures', router);
app.use('/channels', router);
app.use('/tts', router);
app.use('/audio', router);
app.use('/webhook', router);
app.use('/miscellaneous', router);
require(__dirname + '/controllers/userController')(router);
require(__dirname + '/controllers/eventsController')(router);
require(__dirname + '/controllers/translateController')(router);
require(__dirname + '/controllers/articleController')(router);
require(__dirname + '/controllers/languesController')(router);
require(__dirname + '/controllers/roleController')(router);
require(__dirname + '/controllers/imageController')(router);
require(__dirname + '/controllers/themesController')(router);
require(__dirname + '/controllers/traductionController')(router);
require(__dirname + '/controllers/dispositifController')(router);
require(__dirname + '/controllers/structureController')(router);
require(__dirname + '/controllers/channelController')(router, io);
require(__dirname + '/controllers/ttsController')(router);
require(__dirname + '/messenger/controller')(router);
require(__dirname + '/controllers/audioController')(router);
require(__dirname + '/controllers/miscellaneousController')(router);
// app.get('/login-callback', oauthLoginCallback);
// app.get('/logout-callback', oauthLogoutCallback);
// app.get('/user', getUser);


//Partie dédiée à la messagerie instantanée
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('subscribeToChat', function(){
    console.log('user subscribed')
  });
  socket.on('client:sendMessage', function(msg){
    if(msg && msg.data && msg.data.text){
      console.log('message utilisateur : ' + msg.data.text);
    }
    io.emit('MessageSent', msg);
  });
  socket.on('agent:sendMessage', function(msg){
    if(msg && msg.data && msg.data.text){
        console.log('message agent : ' + msg.data.text);
    }
    io.emit('MessageSent', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//Définition et mise en place du port d'écoute
var ioport = process.env.PORTIO;
io.listen(ioport, () => console.log(`Listening on port ${port}`));
var port = process.env.PORT;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => console.log(`Listening on port ${port}`));