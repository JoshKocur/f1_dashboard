const pako = require('pako');

function parseData(json) {
    // probably need a check to see if json is infact a json object or not
    //const jsonData = JSON.parse(json);
    const jsonData = json;
    var parsedData;
    if(jsonData.hasOwnProperty("M")) {
        var message = jsonData["M"];
        if(message instanceof Array) {
            message = message[0];
        } else {
            console.log("PARSER ERROR: Message is not an array.");
            return;
        }
        if(message.hasOwnProperty("H")){
            const hub = message["H"];
            if(hub.toLowerCase() === "streaming") {
                parsedData = message["A"]; // maybe error checking on this access too?
            }
        } else {
            // some sort of error handling/logging needs to go here (and maybe an error count)
            console.log("PARSER ERROR: Message did not have 'H' key");
            return;
        }
    } else {
        // some sort of error handling/logging needs to go here (and maybe an error count)
        console.log("PARSER ERROR: raw message did not have 'M' key");
        return;
    }

    // maybe put the parsing here after all the nested if-else's
    var dataType;
    var dataObject;
    var dataTimeString;
    if(parsedData instanceof Array) {
        // a try catch might be better error handling here, we need to check that
        // 3 entries in the array actually exist
        category = parsedData[0];
        dataObject = parsedData[1];
        dataDateString = parsedData[2];
	// turn dataDateString into a date/timestamp object?
    } else {
        console.log("PARSER ERROR: Data not in array format.");
        return;
    }

    var parsedData = new Object();
    switch(category) {
    case "CarData.z":
	let buff = Buffer.from(dataObject, "base64");
	let decodedString = pako.ungzip(buff, { raw: true, to: 'string' });

	// maybe a function that sets these as this trio is likely to be repeated lots...
	parsedData.category = category;
	parsedData.object = decodedString;
	parsedData.time = dataDateString;

	break;
    }
    

    return parsedData;
}

module.exports = { parseData }
