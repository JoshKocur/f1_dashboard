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
	    dataObject = JSON.parse(decodedString);

	    var Entries = dataObject.Entries;
	    var currObject;
	    var currUtcTime;
	    var currCars;
	    var currDriverObject;
	    for (let i = 0; i < Entries.length; i++) {
		currObject = Entries[i];
		currUtcTime = currObject.Utc;
		currCars = Object.keys(currObject.Cars);
		for (let j = 0; j < currCars.length; j++) {
		    var cleanedObject = new Object();
		    currDriverObject = currObject.Cars[currCars[j]]["Channels"];
		    cleanedObject.DriverNumber = currCars[j];
		    cleanedObject.RPM = currDriverObject["0"];
		    cleanedObject.Speed = currDriverObject["2"];
		    cleanedObject.Gear = currDriverObject["3"];
		    cleanedObject.Throttle = currDriverObject["4"];
		    cleanedObject.DRS = currDriverObject["5"];
		    cleanedObject.Breaks = currDriverObject["45"];
		    cleanedObject.UTC = currUtcTime;
		    parsedData.object.push(cleanedObject);
		}
	    }
	    
	    break;
	case "Position.z":
	    parsedData.category = "DriverData";
	    buff = Buffer.from(dataObject, "base64");
	    decodedString = pako.ungzip(buff, { raw: true, to: 'string' });
	    dataObject = JSON.parse(decodedString);

	    var Position = dataObject.Position;
	    var currObject;
	    var currUtcTime;
	    var currEntries;
	    var currDriverObject;
	    for (let i = 0; i < Position.length; i++) {
		currObject = Position[i];
		currUtcTime = currObject.Timestamp;
		currEntries = Object.keys(currObject.Entries);
		for (let j = 0; j < currEntries.length; j++) {
		    var cleanedObject = new Object();
		    currDriverObject = currObject.Entries[currEntries[j]];
		    cleanedObject.DriverNumber = currEntries[j];
		    cleanedObject.StatusType = currDriverObject["Status"];
		    cleanedObject.X = currDriverObject["X"];
		    cleanedObject.Y = currDriverObject["Y"];
		    cleanedObject.Z = currDriverObject["Z"];
		    cleanedObject.UTC = currUtcTime;
		    parsedData.object.push(cleanedObject);
		}
	    }
	    
	    break;
	case "TimingData":
	    // seems to have several possible different keys with a non-obvious (to me)
	    // pattern for when some are included or left out so we iterate over the keys
	    // we get and handle each key type accordingly
	    var cleanedObject = new Object();
	    var driverNumber = Object.keys(dataObject["Lines"])[0];
	    cleanedObject.driverNumber = driverNumber;
	    var nestedObject = dataObject["Lines"][driverNumber];
	    var nestedKeys = Object.keys(nestedObject);
	    for (let i = 0; i < nestedKeys.length; i++) {
		switch(nestedKeys[i]) {
		case "IntervalToPositionAhead":
		    cleanedObject.intervalToPositionAhead = nestedObject["IntervalToPositionAhead"]["Value"];
		    break;
		case "Sectors":
		    const sectorsKey = Object.keys(nestedObject["Sectors"])[0];
		    cleanedObject.sectors = sectorsKey;
		    // segments seems to be an extra nesting to handle specifically,
		    // so far the rest are 1d nest so we handle them as a general else case
		    if (nestedObject["Sectors"][sectorsKey].hasOwnProperty("Segments")) {
			const segmentsKey = Object.keys(nestedObject["Sectors"][sectorsKey]["Segments"])[0];
			cleanedObject.segments = segmentsKey;
			cleanedObject.status = nestedObject["Sectors"][sectorsKey]["Segments"][segmentsKey]["Status"];
		    } else {
			var key = Object.keys(nestedObject["Sectors"][sectorsKey])[0];
			var keyName = "sectors_" + key;
			cleanedObject[keyName] = nestedObject["Sectors"][sectorsKey][key];
		    }
		    break;
		case "Speeds":
		    var key = Object.keys(nestedObject["Speeds"])[0];
		    cleanedObject.speeds = key;
		    var nKeys = Object.keys(nestedObject["Speeds"][key]);
		    for (let j = 0; j < nKeys.length; j++) {
			var keyName = "speeds_" + nKeys[j];
			cleanedObject[keyName] = nestedObject["Speeds"][key][nKeys[j]];
		    }
		    break;
		default:
		    cleanedObject[nestedKeys[i]] = nestedObject[nestedKeys[i]];
		    break;
		}
	    }
	    parsedData.object.push(cleanedObject);

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
	    parsedData.category = category;
	    parsedData.object.push(dataObject);
	    parsedData.time = dataDateString;

	    break;
	case "TrackStatus":
	    parsedData.category = category;
	    parsedData.time = dataDateString;

	    parsedData.object.push(dataObject);

	    break;
	case "SessionData":
	    parsedData.category = category;
	    parsedData.time = dataDateString;

	    // only aware of a "StatusSeries" key so just hard coding this here until we encounter it failing
	    // then we can think of how to better generalize
	    var cleanedObject = new Object();
	    var statusSeriesKey = Object.keys(dataObject["StatusSeries"])[0];
	    cleanedObject.statusSeries = statusSeriesKey;
	    cleanedObject.utc = dataObject["StatusSeries"][statusSeriesKey]["Utc"];
	    cleanedObject.trackStatus = dataObject["StatusSeries"][statusSeriesKey]["TrackStatus"];

	    parsedData.object.push(cleanedObject);

	    break;
	case "RaceControlMessages":
	    parsedData.category = category;
	    parsedData.time = dataDateString;

	    // only aware of a "Messages" key so just hard coding this here until we encounter it failing
	    // then we can think of how to better generalize
	    var cleanedObject = new Object();
	    var messagesKey = Object.keys(dataObject["Messages"])[0];
	    var messagesKeys = Object.keys(dataObject["Messages"][messagesKey]);
	    cleanedObject.messages = messagesKey;
	    for (let i = 0; i < messagesKeys.length; i++) {
		cleanedObject[messagesKeys[i]] = dataObject["Messages"][messagesKey][messagesKeys[i]];
	    }

	    parsedData.object.push(cleanedObject);

	    break;
	case "SessionInfo":
	    parsedData.category = category;
	    parsedData.time = dataDateString;
	    
	    var cleanedObject = new Object();
	    var Meeting = dataObject.Meeting;
	    
	    cleanedObject.MeetingKey = Meeting.Key;
	    cleanedObject.MeetingName = Meeting.Name;
	    cleanedObject.MeetingLocation = Meeting.Location;
	    cleanedObject.MeetingCountry = Meeting.Country.Name;
	    cleanedObject.MeetingCircuit = Meeting.Circuit.ShortName;
	    cleanedObject.SessionKey = dataObject.Key;
	    cleanedObject.SessionType = dataObject.Type;
	    cleanedObject.SessionName = dataObject.Name;
	    cleanedObject.SessionStartDateUTC = dataObject.StartDate;
	    cleanedObject.SessionEndDateUTC = dataObject.EndDate;
	    cleanedObject.SessionGmtOffset = dataObject.GmtOffset;

	    parsedData.object.push(cleanedObject);

	    break;
	case "ExtrapolatedClock":
	    parsedData.category = category;
	    parsedData.object.push(dataObject);
	    parsedData.time = dataDateString;

	    break;
	case "LapCount":
	    parsedData.category = category;
	    parsedData.object.push(dataObject);
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
