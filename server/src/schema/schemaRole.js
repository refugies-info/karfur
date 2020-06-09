const mongoose = require('mongoose');

var roleSchema = mongoose.Schema({
	nom: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	nomPublique: {
    type: String,
    required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

module.exports = mongoose.model('Role', roleSchema);