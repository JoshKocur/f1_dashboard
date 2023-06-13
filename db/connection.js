/**
 * Code for connecting to the database. 
 * 
 * Tables will not be defined here.
 * 
 */
const mysql = require('mysql');
const config = require('config');

const db_config = config.get('db');


const connection = mysql.createConnection({
    host: db_config.host,
    user: db_config.user,
    password: db_config.password,
    database: db_config.database
  })

connection.connect(function(err){
  if (err) throw err;
});

module.exports=connection;