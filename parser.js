function parseData(json) {
    // probably need a check to see if json is infact a json object or not
    //const jsonData = JSON.parse(json);
    const jsonData = json;
    var parsedData;
    if(jsonData.hasOwnProperty("M")) {
        const message = jsonData["M"][0]; // need a safer way to check if we can index into this here
        if(message.hasOwnProperty("H")){
            const hub = message["H"];
            if(hub.toLowerCase() === "streaming") {
                parsedData = message["A"]; // maybe error checking on this access too?
            }
        } else {
            // some sort of error handling/logging needs to go here (and maybe an error count)
            console.log("PARSER ERROR: Message did not have 'H' key")
            return;
        }
    } else {
        // some sort of error handling/logging needs to go here (and maybe an error count)
        console.log("PARSER ERROR: raw message did not have 'M' key")
        return;
    }

    return parsedData;
}

module.exports = { parseData }