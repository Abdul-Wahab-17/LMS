const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'letmein', 
    database: 'lms'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL as ID', connection.threadId);
});



// Export connection to use it in routes
module.exports = connection;
