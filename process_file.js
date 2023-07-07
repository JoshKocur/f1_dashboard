const fs = require('fs');
const readline = require('readline');

const parser = require('./parser.js');
const interface = require('./db/interface');
const queries = require('./db/queries');


async function processLineByLine(pathToTextFile) {
  const fileStream = fs.createReadStream(pathToTextFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    //console.log(`Line from file: ${line}`);
    let dataArray = parser.parseData(JSON.parse(line));
    if(dataArray){
      dataArray.forEach(function(data){
        let messageType = Object.keys(data)[0];
        let message = data[messageType];
        // what type of message is it?
        for(const [tableName, dbTable] of Object.entries(interface)){
            if(messageType === tableName){
              try {
                // Dummy sessionid for now...
                message.SessionId = 1;
                let record = new dbTable(message);
                let table = new queries[tableName]();
                //table.insert(record);

              } 
              catch (error) {
                  console.log(`Got error with record: ${message} for table ${dbTable.name}`);
                  console.log(error);
              }
            }
        }
      });
    }
  }
}

processLineByLine('./data_race.txt');

module.exports = processLineByLine;