var express = require('express');
var router = express.Router();
var ejs = require('ejs');
const db = require('../db');

router.get('/' , (req , res) => {
    ejs.renderFile('./views/login.ejs' , (err, body) => {
        if (err) throw err;
        res.render('layout' , { title:'LMS' , body });
    });
});

router.post('/' , (req,res) => {
    const { username , password } = req.body;
    var query = 'select password from users where username = ? ' ;
    db.query(query , [username], (err, results) => {
        if (err) throw err;
        if (results.length == 0) res.send('Invalid username or password');
        if (password == results[0].password) res.send('logged in');
        else res.send('invalid login');
    });

});
module.exports = router;