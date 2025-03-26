var express = require('express');
var router = express.Router();
var ejs = require('ejs');

router.get('/', function(req, res) {
  ejs.renderFile('./views/index.ejs',  (err, body) => {
    if (err) throw err;
    res.render('layout', { title: 'LMS', body  });
  });
});

module.exports = router;
