const mongoose = require('mongoose');
const User = require('./schemaUser');

var traductionSchema = mongoose.Schema({
  langueCible: { 
		type: String,
		unique: false,
		required: true
  },
  translatedText: {
    type: Object,
		unique: false,
		required: true
  },
  initialText: {
    type: Object,
		unique: false,
		required: false
  },
  initialTranslatedText: {
    type: Object,
		unique: false,
		required: false
  },
  userId:{ type: mongoose.Schema.ObjectId, ref: 'User' },
  validatorId:{ type: mongoose.Schema.ObjectId, ref: 'User' },
  articleId:{ type: mongoose.Schema.ObjectId, ref: 'Article', required: true },
  status: {
		type: String,
		unique: false,
		required: false
	},
  path:{ 
		type: Object,
		unique: false,
		required: false
  },
  rightId:{
		type: String,
		unique: false,
		required: false
	},
  timeSpent:{
		type: Number,
		unique: false,
		required: false
	},
  nbMots:{
		type: Number,
		unique: false,
		required: false
	},
  jsonId:{
		type: String,
		unique: false,
		required: false
	},
  avancement:{
		type: Number,
		unique: false,
		required: false
  },
  type:{
		type: String,
		unique: false,
		required: false
	},
  title:{
		type: String,
		unique: false,
		required: false
	},
  score:{
		type: Number,
		unique: false,
		required: false
  },
  validatorId: { type: mongoose.Schema.ObjectId, ref: 'User' },
},{ timestamps: { createdAt: 'created_at' }})

traductionSchema.options.autoIndex = false

module.exports = mongoose.model('Traduction', traductionSchema);