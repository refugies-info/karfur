const mongoose = require('mongoose');
var gridStore = require('mongoose-gridstore');

var audioSchema = mongoose.Schema({
	buffer: {
		type: Object,
    required: false
	},
	text: {
    type: String,
    required: false
  },
	status: {
		type: String,
		required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

audioSchema.plugin(gridStore);

module.exports = mongoose.model('Audio', audioSchema);