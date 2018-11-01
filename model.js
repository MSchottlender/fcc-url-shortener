const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const URLGeneratorSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
});

URLGeneratorSchema.methods = {
  createURLObject: function(longURL) {}, // to code
  getURLObject: function(shortURL) {} // to code
}

const URLGenerator = mongoose.model('URLGenerator', URLGeneratorSchema);

const NextAvailableShortURLSchema = new Schema({
  nextShortURL: {
    type: Number,
    min: 1,
    required: true
  }
});

NextAvailableShortURLSchema.methods = {
  setNextAvailableShortURL: function() {
    this.findOneAndUpdate({}, { $inc: { nextShortURL: 1 } }, { options: true }, function(err, currentId) {
      if (err) return { 'error': 'Server error' };
      return currentId;
    });
  },
  getNextAvailableShortURL: function() {
    this.findOne({}, function(err, currentId) {
      if (err) return { 'error': 'Server error' };
      return currentId;
    });
  }
};

const NextAvailableShortURL = mongoose.model('NextAvailableShortURL', NextAvailableShortURLSchema);

module.exports = { URLGenerator, NextAvailableShortURL };