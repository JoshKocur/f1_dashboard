/**
 * Code for connecting to the database. 
 * 
 * Tables will not be defined here.
 * 
 */
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: 's3kreee7',
    database: 'my_db'
  })

exports.default=connection;