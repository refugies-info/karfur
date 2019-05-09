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
// const { MessengerClient } = require('messaging-api-messenger');

// const accessToken ='EAAERWNWISMwBAN1kKuQ5AO7YHZA0YmCimpGOUdZAd2fuiNGvs5YUSB13ZA5jcZCnZAVTZBX93osPZAOQ7fJ6HIZC0Sme8IJPQryAeEXh9OHtqeBgMKvAlk27XZC2lzwv5ZAaohVjtAmXBycypm69Cf8KJJtcAZBA1MK3KTupx5AYJ7gzZAvnahye7sedhowR7mJixJxHNf2tpppz9QZDZD'
// // get accessToken from facebook developers website
// const client = MessengerClient.connect(accessToken);

// // client.getUserProfile('102526574219997').then(user => {
// //   console.log(user);
// // });

// // client.getMessengerProfile(['get_started', 'persistent_menu']).then(profile => {
// //   console.log(profile);
// // });

// client.sendRawBody({
//   recipient: {
//     id: '2199299830183850',
//   },
//   message: {
//     text: 'Hello!',
//   },
// }).catch(error => {
//   console.log(error); // formatted error message
//   // console.log(error.stack); // error stack trace
//   // console.log(error.config); // axios request config
//   // console.log(error.request); // HTTP request
//   // console.log(error.response); // HTTP response
// });

// client.sendText("2199299830183850", 'Hello!');

//souf : "2199299830183850"
//nat: "102526574219997"

let startup, scraper;
if(process.env.NODE_ENV === 'dev') {
  console.log('dev environment')
  startup = require('./startup/startup');
  //scraper = require('./scraper/puppeter');
} 

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

//On définit notre objet express nommé app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Connexion à la base de donnée
mongoose.set('debug', false);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/db', { useNewUrlParser: true }).then(() => {
    console.log('Connected to mongoDB');
    if(process.env.NODE_ENV === 'dev') {
      startup.run(mongoose.connection.db); //A décommenter pour initialiser la base de données
    } 
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(formData.parse());
app.use(express.static(path.join(__dirname, "client", "build")))
app.use(cors());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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
app.use('/channels', router);
app.use('/tts', router);
app.use('/webhook', router);
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
require(__dirname + '/controllers/channelController')(router, io);
require(__dirname + '/controllers/audioController')(router);
require(__dirname + '/messenger/controller')(router);


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