var express = require('express');
var router = express.Router();
var ejs = require('ejs');

router.get('/', function(req, res, next) {
  ejs.renderFile('./views/index.ejs', { 
    title: 'Express', 
    user: 'Roger',
    items: ['Item 1', 'Item 2', 'Item 3']
  }, (err, body) => {
    if (err) throw err;
    res.render('layout', { title: 'Express', body  });
  });
});

module.exports = router;
