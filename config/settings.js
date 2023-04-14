/**
 * Currently, reading from `./config.json`
 * 
 * Will look into adding defaults later.
 */
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

exports.default=config;