var express = require('express');
var router = express.Router();
var connection = require('../db');

router.get('/' , (req,res) => {
     connection.query('select * from users' , (error, results) => {
        if (error) {
            console.error('Error fetching users from the database: ' + error.stack);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
      res.json(results);
 });


    });

module.exports = router;