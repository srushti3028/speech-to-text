const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
  filename: String,
  transcription: String,
  createdAt: Date
});

module.exports = mongoose.model('Transcription', transcriptionSchema);
