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
	parsedData.category = category;
	parsedData.object = [];
	parsedData.time = dataDateString;
	switch(category) {
	case "CarData.z":
	    buff = Buffer.from(dataObject, "base64");
	    decodedString = pako.ungzip(buff, { raw: true, to: 'string' });

	    parsedData.object = decodedString;
	    
	    break;
	case "Position.z":
	    buff = Buffer.from(dataObject, "base64");
	    decodedString = pako.ungzip(buff, { raw: true, to: 'string' });

	    parsedData.object = decodedString;
	    
	    break;
	case "TimingData":
	    // three??? two cases: gap to leader or sector status	    
	    var cleanedObject = new Object();
	    var driverNumber = Object.keys(dataObject["Lines"])[0];
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
	    // two cases: best speeds and best lap time, but sometimes come together
	    var driverNumbers = Object.keys(dataObject["Lines"]);
	    for (let i = 0; i < driverNumbers.length; i++) {
		var cleanedObject = new Object();
		cleanedObject.driverNumber = driverNumbers[i];
		var nestedObject = dataObject["Lines"][driverNumbers[i]];
		const keys = Object.keys(nestedObject);
		for (let j = 0; j < keys.length; j++) {
		    if (keys[j] == "BestSpeeds") {
			const bestSpeed = Object.keys(nestedObject["BestSpeeds"])[0];
			cleanedObject.bestSpeed = bestSpeed;
			const bestSpeedKeys = Object.keys(nestedObject["BestSpeeds"][bestSpeed]);
			for (let k = 0; k < bestSpeedKeys.length; k++) {
			    cleanedObject[bestSpeedKeys[k]] = nestedObject["BestSpeeds"][bestSpeed][bestSpeedKeys[k]];
			}
		    } else {
			const lapKeys = Object.keys(nestedObject["PersonalBestLapTime"]);
			for (let k = 0; k < lapKeys.length; k++) {
			    cleanedObject[lapKeys[k]] = nestedObject["PersonalBestLapTime"][lapKeys[k]];
			}
		    }
		}
		parsedData.object.push(cleanedObject);
	    }

	    break;
	case "DriverList":
	    // I think it is driverNumber: {"Line": x} where "Line" means position and x is
	    // the position
	    var driverNumbers = Object.keys(dataObject);
	    var driverPosition;
	    for (let i = 0; i < driverNumbers.length; i++) {
		var cleanedObject = new Object();
		driverPosition = dataObject[driverNumbers[i]]["Line"];
		cleanedObject.driverNumber = driverNumbers[i];
		cleanedObject.driverPosition = driverPosition;
		parsedData.object.push(cleanedObject);
	    }

	    break;
	case "TimingAppData":
	    // I think it is driverNumber: {"Line": x} where "Line" means ??? and x is ???
	    var driverNumbers = Object.keys(dataObject["Lines"]);
	    var line;
	    for (let i = 0; i < driverNumbers.length; i++) {
		var cleanedObject = new Object();
		line = dataObject["Lines"][driverNumbers[i]]["Line"];
		cleanedObject.driverNumber = driverNumbers[i];
		cleanedObject.line = line;
		parsedData.object.push(cleanedObject);
	    }

	    break;
	case "Heartbeat":
	    parsedData.object.push(dataObject);

	    break;
	case "TopThree":
	    // 2 cases, lap state and difftoahead
	    var cleanedObject = new Object();
	    var driverNumber = Object.keys(dataObject["Lines"])[0];
	    var keys = Object.keys(dataObject["Lines"][driverNumber]);
	    cleanedObject.driverNumber = driverNumber;
	    if (keys[0] == "LapState") {
		cleanedObject.lapState = dataObject["Lines"][driverNumber]["LapState"];
	    } else {
		var diffToAhead = dataObject["Lines"][driverNumber]["DiffToAhead"];
		var diffToLeader = dataObject["Lines"][driverNumber]["DiffToLeader"];
		cleanedObject.diffToAhead = diffToAhead;
		cleanedObject.diffToLeader = diffToLeader;
	    }
	    parsedData.object.push(cleanedObject);

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
