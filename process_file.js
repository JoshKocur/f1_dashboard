const fs = require('fs');
const readline = require('readline');

const parser = require('./parser.js');


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
    let data = parser.parseData(JSON.parse(line));
    console.log(data);
  }
}

processLineByLine('./short_file.txt');