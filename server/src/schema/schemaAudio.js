const mongoose = require('mongoose');
// var gridStore = require('mongoose-gridstore');

var audioSchema = mongoose.Schema({
  public_id: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  resource_type: {
    type: String,
    required: false
  },
  bytes: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  etag: {
    type: String,
    required: false
  },
  original_filename: {
    type: String,
    required: false
  },
  secure_url: {
    type: String,
    required: false
  },
  signature: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  version: {
    type: String,
    required: false
  },
},{ timestamps: { createdAt: 'created_at' }})

// audioSchema.plugin(gridStore);

module.exports = mongoose.model('Audio', audioSchema);