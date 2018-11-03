const dns = require('dns');
const model = require('./model');

const controller = {
  generateURL: function(req, res) {
      const inputURL = req.body.url;

      dns.lookup(inputURL, function(err, address) {
        if (err) {
          res.send({ error: 'Invalid URL' });
        } else {
          // res.send({ original_url: inputURL, short_url: 1 });
          model.generateURLObject(inputURL, function(URLObject) {
            res.send(URLObject);
          });        
        }
      });
  },
  redirectToURL: function(req, res) {
      const inputURL = req.params.shortURL;

      model.getURLObject(inputURL, function(originalURL) {
        if (typeof originalURL === 'object') return res.send(originalURL);
        res.redirect(originalURL);
      });
  }
}

module.exports = controller;