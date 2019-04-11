const mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
  itemId:{ type: mongoose.Schema.ObjectId, required: true },
  itemName:{
		type: String,
		unique: false,
		required: false
  },
  filter:{
		type: String,
		unique: false,
		required: false
	},
  messages: {
    type: Object,
		unique: false,
		required: false
  },
  users:[{ type: mongoose.Schema.ObjectId, ref: 'User', required: false }],
  status: {
		type: String,
		unique: false,
		required: false
	},
  path:{ 
		type: String,
		unique: false,
		required: false
  },
  type:{ 
		type: String,
		unique: false,
		required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

channelSchema.options.autoIndex = false

module.exports = mongoose.model('Channel', channelSchema);