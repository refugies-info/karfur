const mongoose = require('mongoose');

var traductionDispositif = mongoose.Schema({
  titreMarque: {
    type: Object,
		unique: false,
		required: true
  },
  titreInformatif: { 
		type: String,
		unique: false,
		required: true
  },
  abstract: {
    type: String,
		unique: false,
		required: false
  },
  contact: {
    type: String,
		unique: false,
		required: false
  },
  contenu: {
    type: Object,
		unique: false,
    required: false
  },
  sponsors: {
    type: Object,
		unique: false,
    required: false
  },
  audience: {
    type: Object,
		unique: false,
    required: false
  },
  audienceAge: {
    type: Object,
		unique: false,
    required: false
  },
  tags: {
    type: Object,
		unique: false,
    required: false
  },
  localisation: {
    type: Object,
		unique: false,
    required: false
  },
  creatorId:{ type: mongoose.Schema.ObjectId, ref: 'User' },
  status: {
		type: String,
		unique: false,
		required: false
	},
  nbMots:{
		type: Number,
		unique: false,
		required: false
	},
},{ timestamps: { createdAt: 'created_at' }})

traductionDispositif.options.autoIndex = false

module.exports = mongoose.model('Dispositif', traductionDispositif);