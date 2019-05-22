const mongoose = require('mongoose');

var dispositifSchema = mongoose.Schema({
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
  avancement:{
    type:Number,
    required:false,
    unique:false
  },
  merci:{
    type:Object,
    required:false,
  },
  bravo:{
    type:Object,
    required:false,
  },
  suggestions:{
    type:Object,
    required:false,
  },
  questions:{
    type:Object,
    required:false,
  },
  signalements:{
    type:Object,
    required:false,
  },
},{ timestamps: { createdAt: 'created_at' }})

dispositifSchema.options.autoIndex = false

module.exports = mongoose.model('Dispositif', dispositifSchema);