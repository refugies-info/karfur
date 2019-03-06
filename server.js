//Définition des modules
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//On définit notre objet express nommé app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Connexion à la base de donnée
mongoose.connect('mongodb://localhost/db').then(() => {
    console.log('Connected to mongoDB')
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
app.use('/user', router);
app.use('/events', router);
app.use('/translate', router);
require(__dirname + '/controllers/userController')(router);
require(__dirname + '/controllers/eventsController')(router);
require(__dirname + '/controllers/translateController')(router);

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
var ioport = 8001;
io.listen(ioport, () => console.log(`Listening on port ${port}`));
var port = 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));