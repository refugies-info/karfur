const mongoose = require('mongoose');

var dispositifSchema = mongoose.Schema({
  titreMarque: {
    type: Object,
		unique: false,
		required: false
  },
  titreInformatif: { 
		type: Object,
		unique: false,
		required: true
  },
  abstract: {
    type: Object,
		unique: false,
		required: false
  },
  contact: {
    type: String,
		unique: false,
		required: false
  },
  externalLink: {
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
  mainSponsor:{ type: mongoose.Schema.ObjectId, ref: 'Structure' },
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
  niveauFrancais: {
    type: Object,
		unique: false,
    required: false
  },
  creatorId:{ type: mongoose.Schema.ObjectId, ref: 'User' },
  status: {
		type: String,
		unique: false,
    required: false,
    enum: ["Actif", "Accepté structure", "En attente", "En attente admin", "En attente non prioritaire", "Brouillon", "Rejeté structure", "Rejeté admin", "Inactif", "Supprimé"]
	},
  nbMots:{
		type: Number,
		unique: false,
		required: false
  },
  merci:{
    type:Object,
    required:false,
  },
  pasMerci:{
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
  traductions:{ 
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Traduction' }],
    required: false
  },
  participants:{
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    required:false,
  },
  avancement:{
    type:Object,
    required:false,
  },
  timeSpent:{
		type: Number,
		unique: false,
		required: false
	},
  variantes: {
    type: Object,
		unique: false,
    required: false
  },
  typeContenu: {
    type: String,
		unique: false,
    required: false,
    enum: ["dispositif", "demarche"]
  },
  demarcheId:{ type: mongoose.Schema.ObjectId, ref: 'Dispositif' },
  autoSave: {
    type: Boolean,
		unique: false,
    required: false
  },
  responsable: {
    type: String,
    enum: ["Hugo", "Simon", "Nour", "Développeur", "Groot", "Starlord"]
  },
  internal_action: {
    type: String,
    enum: ["Prêt", "Contact", "Relire", "En attente", "Refaire", "URGENT", "Discuter", "Nouveau"]
  },
},{ timestamps: { createdAt: 'created_at' }})

//mongoose.set('useCreateIndex', true);
//dispositifSchema.options.createIndex = ({updatedAt: -1});

// Dispositif.collection.dropIndex('titreInformatif');

module.exports = mongoose.model('Dispositif', dispositifSchema);