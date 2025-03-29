var express = require('express');
var ejs = require('ejs');
var router = express.Router();
const ensureAuthenticated = require('./auth'); 

router.get('/', ensureAuthenticated, (req, res) => {
    res.send('kill yoirself');
});

module.exports = router;