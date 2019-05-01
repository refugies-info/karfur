const User = require('../../schema/schemaUser.js');
const Role = require('../../schema/schemaRole.js');
const jwt = require('jwt-simple');
let config = {};
if(process.env.NODE_ENV === 'dev') {
  config = require('../../config/config');
} 

check = (req, res, next) => {
  let token = req.headers['authorization'] || req.headers['x-access-token'];
  
  if(!token || token === null || token === undefined || token === 'undefined')
    return res.status(403).send({ auth: false, message: "No token found."})
  
  let decoded=jwt.decode(token, process.env.SECRET || config.secret);

  if(!decoded || decoded === null || decoded === undefined || decoded === 'undefined')
    return res.status(404).send({ auth: false, message: "No user found."});

  User.findById(decoded._id)
    .populate('roles')
    .exec(function (err, user) {
      if (err) return res.status(500).send({ auth: false, message: "There was a problem finding the user."});
      if (!user) return res.status(404).send({ auth: false, message: "No user found."});
      let userCopy={...user.toObject()};
      delete userCopy.password;
      req.userId=userCopy._id;
      req.user=userCopy;
      next();
    });
}

getId = (req, res, next) => {
  let token = req.headers['authorization'] || req.headers['x-access-token'];
  
  req.userId=undefined;
  if(token !== null && token !== undefined && token !== 'undefined'){
    let decoded=jwt.decode(token, process.env.SECRET || config.secret);
    if(decoded){
      req.user=decoded;
      req.userId=decoded._id;
    }
  }
  next();
}

getRoles = (req, res, next) => {
  Role.find({})
    .exec(function (err, roles) {
      if (err) 
        console.log(err)
      req.roles=roles;
      next();
    });
}

exports.check = check;
exports.getId = getId;
exports.getRoles=getRoles;