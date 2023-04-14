/**
 * Code for connecting to the database. 
 * 
 * Tables will not be defined here.
 * 
 */
const mysql = require('mysql');
const config = require('../config/settings');
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  })

exports.default=connection;