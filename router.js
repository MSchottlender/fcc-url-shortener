const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/:shortURL', controller.redirectToURL);
router.post('/new', controller.addURL);
  

module.exports = router;