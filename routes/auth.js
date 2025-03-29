var express = require('express');
var router = express.Router();
var ejs = require('ejs');
const db = require('../db'); 
var crypto = require('crypto');
var localStrategy = require('passport-local');
var passport = require('passport');

passport.use(new localStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM users WHERE username = ?', [username], function(err, results) {
        if (err) return cb(err);
  
        if (results.length === 0) {
            console.error("❌ No user found with username:", username);
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
  
        const row = results[0];
  
  
        if (!row.password || !row.salt) {
            console.error("❌ Missing password or salt in database");
            return cb(new Error("Database missing required fields"));
        }
  
       const storedHash = row.password;  
       const storedSalt = row.salt;
       
        // Hash input password using the stored salt
        crypto.pbkdf2(password, storedSalt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) return cb(err);
  
            if (!crypto.timingSafeEqual(storedHash  , hashedPassword)) {
                console.error("❌ Hash mismatch: Incorrect password");
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
  }));

passport.serializeUser(function(user,cb){
    process.nextTick(function(){
        cb(null,{id: user.id , username: user.username});
    });
});

passport.deserializeUser(function(user,cb){
    process.nextTick(function(){
        return cb(null,user);
    });
});
  
router.get('/login', (req, res) => {
 ejs.renderFile('./views/login.ejs',  (err, body) => {
     if (err) throw err;
     res.render('layout', { title: 'LMS', body  });
   });
 });

router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login'
}));



router.post('/logout' , function(req,res,next){
    req.logout(function(err){
        if (err){ return next(err);}
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    ejs.renderFile('./views/logout.ejs',  (err, body) => {
        if (err) throw err;
        res.render('layout', { title: 'LMS', body  });
      });
    });


router.get('/register' , (req , res ) =>{
    ejs.renderFile('./views/register.ejs' , (err , body) => {
        if (err) { throw err;}
        res.render('layout' , {title : 'LMS' , body});
    });
} );

router.post('/register' , (req , res , next)=>{
    const { username , password} = req.body;
    const query = 'insert into users ( username , password , salt) values ( ?,?,?)';

    db.query(' select * from users where username = ?' , [username] , (err , results) =>{
        if (err) {throw err;}
        if (results.length !== 0) {
            return res.status(400).send( 'Username already exists' );
        }
        
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(password , salt,310000 , 32 , 'sha256' , (err , derivedKey)=>{
            if (err) throw err;
            db.query(query, [username, derivedKey, salt], (err) => {

                if (err) {throw err};
                var user = { id: this.id , username: username}
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                  });
            }  );
        } )
    })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed
    }
    res.status(401).send(  "Unauthorized: Please log in" );
}

module.exports = {router , ensureAuthenticated};