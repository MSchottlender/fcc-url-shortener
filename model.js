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

const URLGenerator = mongoose.model('URLGenerator', URLGeneratorSchema);

const NextAvailableShortURLSchema = new Schema({
  nextShortURL: {
    type: Number,
    min: 1,
    required: true
  }
});

const init = function() {
  NextAvailableShortURL.findOne({}, function(err, availableShortURL) {
    if (err) {
      console.error(err);
    } else if (availableShortURL === null) {
      initShortURL = new NextAvailableShortURL({ nextShortURL: 1 });
      initShortURL.save(function(err, initializedShortURL) {
        if (err) {
          console.error(err);
        } else {
          console.log('initialized available short url: ', initializedShortURL.nextShortURL);
        }
      });
    }
  });
}

// NextAvailableShortURLSchema.methods = {
//   setNextAvailableShortURL: function() {
//     this.findOneAndUpdate({}, { $inc: { nextShortURL: 1 } }, { options: true }, function(err, currentId) {
//       if (err) return { 'error': 'Server error' };
//       return currentId;
//     });
//   },
//   getNextAvailableShortURL: function() {
//     this.findOne({}, function(err, currentId) {
//       if (err) return { 'error': 'Server error' };
//       return currentId;
//     });
//   }
// };

const NextAvailableShortURL = mongoose.model('NextAvailableShortURL', NextAvailableShortURLSchema);

const model = {
  setNextAvailableShortURL: function() {},
  getNextAvailableShortURL: function() {},
  generateURLObject: function(originalURL, cb) {
    
    // check if url already in database

    // figure out why select is not working 
    URLGenerator.findOne({ original_url: originalURL }, function(err, record) {
      if (err) {
        console.log(err);
        return cb({ error: 'Internal server error' });
      } 

      // remove this after you have figured out select issue    
      if (record) {
        const publicRec = Object.assign({}, { original_url: record.original_url, short_url: record.short_url });
        return cb(publicRec);
      }

      // generate new url object
      // -- take next available short url
      NextAvailableShortURL.findOneAndUpdate({}, { $inc: { nextShortURL: 1 } }, function(err, recShort) {
        if (err) {
          console.error(err);
          return cb({ error: 'Internal server error' });
        }
        
        URLGenerator.create({ original_url: originalURL, short_url: recShort.nextShortURL }, function(err, recURLs) {
          if (err) {
            console.error(err);
            return cb({ error: 'Internal server error' });
          }
          const publicURLObject = Object.assign({}, { original_url: recURLs.original_url, short_url: recURLs.short_url });
          cb(publicURLObject);
        });
      });
    });
  },
  getURLObject: function(shortURL, cb) {}
};

// initialize if neccessary
init();

module.exports = model;