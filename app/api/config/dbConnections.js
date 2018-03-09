const mysql = require('mysql');

var connections = mysql.createPool({
        host: 'localhost',
        user: 'waihong',
        password: 'yy8JmwWe',
        database: 'govtech_assignment_waihong',
        port: '63316'
});


module.exports = connections;
