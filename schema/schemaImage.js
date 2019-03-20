const mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
	public_id: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	format: {
		type: String,
		required: false
	},
	height: {
    type: Number,
    required: false
  },
	width: {
    type: Number,
    required: false
  },
	original_filename: {
		type: String,
		required: false
  },
	secure_url: {
		type: String,
		required: false
  },
	signature: {
		type: String,
		required: false
	},
	url: {
		type: String,
		required: false
	},
	version: {
		type: String,
		required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

module.exports = mongoose.model('Image', imageSchema);