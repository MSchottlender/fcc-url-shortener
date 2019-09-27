'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://mschott:bwmVdGR5EYgkglox@cluster0-lzvdg.mongodb.net/test?retryWrites=true&w=majority');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedParser);

var numShort = 0;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  original_url : String ,
  short_url :  Number,
});

var urlAlternative = mongoose.model('urlAlternative',urlSchema);

app.use("/api/shorturl/new",(req,res)=>{
  if(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig.test(req.body.url)){
  numShort ++;
  const pack = new urlAlternative({original_url: req.body.url,
            short_url: numShort});
  res.send({original_url: req.body.url,
            short_url: numShort});
  pack.save((err,data)=>{
    if(err) console.log("Failure at saving")
  })
  } else {
  res.send({error: "invalid URL"});
  }
});

app.use("/api/shorturl/:number",(req,res)=>{
  urlAlternative.findOne({short_url: req.params.number},(err,data)  => {
    if(err) res.send({error: "short URL not recognized"})
    res.redirect(data.original_url)
  });
  
});
