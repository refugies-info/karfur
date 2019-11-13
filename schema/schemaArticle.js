const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: {
		type: Object,
		unique: false,
		required: false
	},
  body: {
    type: Object,
		unique: false,
		required: false
  },
  nombreMots:{
    type:Number,
    required:false,
    unique:false
  },
  avancement:{
    type:JSON,
    required:false,
    unique:false
  },
  status:{
    type:String,
    required:false,
    unique:false
  },
  traductions:{ 
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Traductions' }],
    required: false
  },
  isStructure:{ 
    type: Boolean,
    required: false
  },
  canBeUpdated:{ 
    type: Boolean,
    required: false
  }
},{ timestamps: { createdAt: 'created_at' }})

articleSchema.options.autoIndex = false

module.exports = mongoose.model('Article', articleSchema);