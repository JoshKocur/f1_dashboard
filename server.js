const parser = require('./parser.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000

app.use(bodyParser.json());


/**
 * Toy api for just accepting json data via a post request
 * E.g.
 * 
 * curl --header "Content-Type: application/json"   --request POST   --data '{"foo":"xyz","bar":"xyz"}'   http://localhost:3000/parse
 * 
 */
app.post('/parse', (req, resp) => {
    let data = req.body;
    console.log(data);
    var parsedData = parser.parseData(data);
    if(parsedData) {
        console.log('successfully parsed data:');
        console.log(parsedData);
    }
    
    resp.send(`Got ... ${data}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })