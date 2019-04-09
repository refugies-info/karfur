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
  contenu: {
    type: Object,
    required: false
  },
  // description: {
  //   type: String,
	// 	unique: false,
	// 	required: false
  // },
  // logo: {
  //   type: Object,
  //   required: false
  // },
  // lienRenvoi: {
  //   type: String,
	// 	unique: false,
	// 	required: false
  // },
  // beneficiaires: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // detail: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // monInteret: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // proceduresAcces: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // interlocuteursAcces: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // territoiresAcces: {
  //   type: Object,
	// 	unique: false,
	// 	required: false
  // },
  // dispositifsSimilaires: {
  //   type: [{ type: mongoose.Schema.ObjectId, ref: 'Dispositif' }],
	// 	unique: false,
	// 	required: false
  // },
  // dispositifsComplementaires: {
  //   type: [{ type: mongoose.Schema.ObjectId, ref: 'Dispositif' }],
	// 	unique: false,
	// 	required: false
  // },
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