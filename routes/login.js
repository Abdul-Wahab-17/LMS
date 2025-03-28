var express = require('express');
var router = express.Router();
var ejs = require('ejs');
const db = require('../db');  // Ensure this points to your MySQL connection
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
  
        console.log("✅ Database result:", row);
  
        if (!row.password || !row.salt) {
            console.error("❌ Missing password or salt in database");
            return cb(new Error("Database missing required fields"));
        }
  
        // Convert BLOB to Hex string
        const storedHash = row.password.toString('hex');  // FIXED: using correct column name
        const storedSalt = row.salt.toString('hex');
  
        console.log("🔹 Stored hashed_password:", storedHash);
        console.log("🔹 Stored salt:", storedSalt);
  
        // Hash input password using the stored salt
        crypto.pbkdf2(password, Buffer.from(storedSalt, 'hex'), 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) return cb(err);
  
            // Compare stored hash with computed hash
            if (!crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), hashedPassword)) {
                console.error("❌ Hash mismatch: Incorrect password");
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
  
            console.log("✅ Authentication successful!");
            return cb(null, row);
        });
    });
  }));
  
router.get('/', (req, res) => {
 ejs.renderFile('./views/login.ejs',  (err, body) => {
     if (err) throw err;
     res.render('layout', { title: 'LMS', body  });
   });
 });

router.post('/', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/'
}));

module.exports = router;
