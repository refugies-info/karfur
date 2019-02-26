const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const config = require('../config/config');

var userSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
    type: String,
    required: true
  }
},{ timestamps: { createdAt: 'created_at' }})


userSchema.methods = {
	authenticate: function (password) {
		return passwordHash.verify(password, this.password);
	},
	getToken: function () {
		return jwt.encode(this, config.secret);
	}
}

module.exports = mongoose.model('User', userSchema);