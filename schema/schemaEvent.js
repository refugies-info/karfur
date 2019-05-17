const mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  app: {
		type: String,
		unique: false,
		required: true
	},
  layout: {
		type: String,
		unique: false,
		required: false
	},
	page: {
		type: String,
		unique: false,
		required: false
	},
	component: {
		type: String,
		required: false
	},
	action: {
    type: String,
    required: false
	},
	label: {
		type: String,
		required: false
	},
	value: {
		type: String,
		required: false
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cookie: {
		type: String,
		required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

module.exports = mongoose.model('Event', eventSchema);