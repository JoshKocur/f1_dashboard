const pako = require('pako');

function parseData(json) {
    // probably need a check to see if json is infact a json object or not
    //const jsonData = JSON.parse(json);
    const jsonData = json;
    var parsedData;
    var dataToParse = [];
    if(jsonData.hasOwnProperty("M")) {
        var messages = jsonData["M"];
        if(messages instanceof Array) {
	    var numMessages = messages.length;
	    for (var i = 0; i < numMessages; i++) {
		const message = messages[i];
		if(message.hasOwnProperty("H")){
		    const hub = message["H"]; // maybe error checking on this access too?
		    if(hub.toLowerCase() === "streaming") {
			dataToParse.push(message["A"]); // maybe error checking on this access too?
			// if this fails maybe it just isnt added to array, but the array could
			// contain other valid messages that we want to parse and return
			// and not just fail (haven't seen this yet, will change code when we encounter
			// this case)
		    }
		} else {
		    console.log("PARSER ERROR: message did not have 'H' key");
		    return;
		}
            }
	} else {
            console.log("PARSER ERROR: did not receive array of messages.");
            return;
        }   
    } else {
        // some sort of error handling/logging needs to go here (and maybe an error count)
        console.log("PARSER ERROR: raw message did not have 'M' key");
        return;
    }

    var allParsedData = [];
    var currentData;
    var numDataToParse = dataToParse.length;
    var category;
    var dataObject;
    var dataDateString;
    var buff;
    var decodedString;
    for (var i = 0; i < numDataToParse; i++) {
	currentData = dataToParse[i];
	if(currentData instanceof Array) {
	    // a try catch might be better error handling here, we need to check that
	    // 3 entries in the array actually exist
	    category = currentData[0];
	    dataObject = currentData[1];
	    dataDateString = currentData[2];
	    // turn dataDateString into a date/timestamp object?
	} else {
	    console.log("PARSER ERROR: Data not in array format.");
	    return;
	}

	var parsedData = new Object();
	switch(category) {
	case "CarData.z":
	    buff = Buffer.from(dataObject, "base64");
	    decodedString = pako.ungzip(buff, { raw: true, to: 'string' });

	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = decodedString;
	    parsedData.time = dataDateString;

	    break;
	case "Position.z":
	    buff = Buffer.from(dataObject, "base64");
	    decodedString = pako.ungzip(buff, { raw: true, to: 'string' });

	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = decodedString;
	    parsedData.time = dataDateString;

	    break;
	case "TimingData":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.time = dataDateString;

	    // two cases: gap to leader or sector status	    
	    var cleanedObject = new Object();
	    const driverNumber = Object.keys(dataObject["Lines"])[0];
	    cleanedObject.driverNumber = driverNumber;
	    var nestedObject = dataObject["Lines"][driverNumber];
	    if (nestedObject.hasOwnProperty("GapToLeader")) {
		cleanedObject.gapToLeader = nestedObject["GapToLeader"];
		cleanedObject.intervalToPositionAhead = nestedObject["IntervalToPositionAhead"]["Value"];
	    } else {
		const sectorsKey = Object.keys(nestedObject["Sectors"])[0];
		cleanedObject.sectors = sectorsKey;
		const segmentsKey = Object.keys(nestedObject["Sectors"][sectorsKey]["Segments"])[0];
		cleanedObject.segments = segmentsKey;
		cleanedObject.status = nestedObject["Sectors"][sectorsKey]["Segments"][segmentsKey]["Status"];
	    }
	    parsedData.object = [cleanedObject];

	    break;
	case "TimingStats":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = [];
	    parsedData.time = dataDateString;

	    // two cases: best speeds and best lap time
	    const driverNumbers = Object.keys(dataObject["Lines"]);
	    for (let i = 0; i < driverNumbers.length; i++) {
		var cleanedObject = new Object();
		cleanedObject.driverNumber = driverNumbers[i];
		var nestedObject = dataObject["Lines"][driverNumbers[i]];
		if (nestedObject.hasOwnProperty("BestSpeeds")) {
		    const bestSpeed = Object.keys(nestedObject["BestSpeeds"])[0];
		    cleanedObject.bestSpeed = bestSpeed;
		    const bestSpeedKeys = Object.keys(nestedObject["BestSpeeds"][bestSpeed]);
		    for (let j = 0; j < bestSpeedKeys.length; j++) {
			cleanedObject[bestSpeedKeys[j]] = nestedObject["BestSpeeds"][bestSpeed][bestSpeedKeys[j]];
		    }
		} else {
		    const sectorsKey = Object.keys(nestedObject["Sectors"])[0];
		    cleanedObject.sectors = sectorsKey;
		    const segmentsKey = Object.keys(nestedObject["Sectors"][sectorsKey]["Segments"])[0];
		    cleanedObject.segments = segmentsKey;
		    cleanedObject.status = nestedObject["Sectors"][sectorsKey]["Segments"][segmentsKey]["Status"];
		}
		parsedData.object.push(cleanedObject);
	    }
	    

	    break;
	case "DriverList":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "TimingAppData":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "Heartbeat":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "TopThree":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "WeatherData":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "TrackStatus":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "SessionData":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "RaceControlMessages":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "SessionInfo":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "ExtrapolatedClock":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;
	case "LapCount":
	    // maybe a function that sets these as this trio is likely to be repeated lots...
	    parsedData.category = category;
	    parsedData.object = dataObject;
	    parsedData.time = dataDateString;

	    break;

	default:
	    console.log("PARSER ERROR: Did not recognize message category: " + (category));
	    return;
	}
	allParsedData.push(parsedData)
    }

    return allParsedData;
}

module.exports = { parseData }
