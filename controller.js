const dns = require('dns');
const model = require('./model');

const controller = (function() {
  // private methods

  // public API
  return {
    addURL: function(req, res) {
      const inputURL = req.body.url;
      dns.lookup(inputURL, function(err, addresse) {
        if (err) {
          res.send({ error: 'Invalid URL' });
        } else {
          // here it first need to check if url already in 
          // db and if not it needs to get next available
          // short url from db
          res.send({ original_url: inputURL, short_url: 1 });
        }
      });
    },
    redirectToURL: function(req, res) {
      
    }
  }
})();

module.exports = controller;