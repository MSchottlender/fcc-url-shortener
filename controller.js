const dns = require('dns');
const model = require('./model');

const controller = {
  generateURL: function(req, res) {
      const inputURL = req.body.url;

      const _removeProtocolFromURL = function(url) {
        if (url[4] == 's') return url.substr(8);
        return url.substr(7);
      }

      const host = _removeProtocolFromURL(inputURL);

      dns.lookup(host, function(err, address) { 
        if (err) {
          res.send({ error: 'Invalid URL' });
        } else {
          model.generateURLObject(host, function(URLObject) {
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