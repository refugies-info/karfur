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
	}
},{ timestamps: { createdAt: 'created_at' }})

articleSchema.options.autoIndex = false

module.exports = mongoose.model('Article', articleSchema);