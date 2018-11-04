'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = require('./router');

const app = express();

// basic configuration 
const PORT = process.env.PORT || 3000;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASS}@ds151523.mlab.com:51523/url-shortener-micro`;

// set up database connection
mongoose.Promise = global.Promise;
const mongoOptions = { useMongoClient: true };
mongoose.connect(MONGO_URL, mongoOptions)
  .then(function() {
    console.log('connected to database url-shortener');
  })
  .catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });

// implement middlewares
app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);

app.use('/public', express.static(process.cwd() + '/public'));

// implement router
app.use('/api/shorturl/', router);
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/*', function(req, res) {
  res.redirect('/');
});

// mount server
app.listen(PORT, function () {
  console.log(`Node.js listening on port ${PORT}...`);
});