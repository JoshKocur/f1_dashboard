// npm i axios
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const ws = require('ws');
const fs = require('fs');

async function negotiate() {
	const hub = encodeURIComponent(JSON.stringify([{name:"Streaming"}]));
	const url = `https://livetiming.formula1.com/signalr/negotiate?connectionData=${hub}&clientProtocol=1.5`
	const resp = await axios.get(url);
	return resp;
}

// add message to array, then write array to a file

async function connectwss(token, cookie) {
	const hub = encodeURIComponent(JSON.stringify([{name:"Streaming"}]));
	const encodedToken = encodeURIComponent(token);
	const url = `wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${encodedToken}&connectionData=${hub}`
	const p = new Promise((res) => {
		const sock = new ws.WebSocket(url, {
            headers: {
                'User-Agent': 'BestHTTP',
                'Accept-Encoding': 'gzip,identity',
                'Cookie': cookie
		    }}
        );

	sock.on('open', ev => {
	    res(sock);
	});
	sock.on('message', (data) => {
	    console.log('received %s', data);
	    // TODO: I am thinking here will be a call to a function that parses the data
	    // for now the parser might handle storing the data as well, but this could be
	    // split up in the future
	    // parseData(data);
            const stream = fs.createWriteStream('./data.txt', {'flags': 'a'});
            stream.write(data + '\n');
	});
	});
	return p
}


async function main() {
	try {
        const streams = [
            "Heartbeat",
            "CarData.z", 
            "Position.z",
            "ExtrapolatedClock", 
            "TopThree", 
            "RcmSeries",
            "TimingStats", 
            "TimingAppData",
            "WeatherData", 
            "TrackStatus", 
            "DriverList",
            "RaceControlMessages", 
            "SessionInfo",
            "SessionData", 
            "LapCount", 
            "TimingData"
        ];
		const resp = await negotiate();
		console.log(resp.data);
		console.log(resp.headers);
        const sock = await connectwss(resp.data['ConnectionToken'], resp.headers['set-cookie']);
        sock.send(JSON.stringify(
            {
                "H": "Streaming",
                "M": "Subscribe",
                "A": [streams],
                "I": 1
            }
        ));
	} catch(e) {
		console.error(e);
	}
}

// TODO -- 
// Enable this when you want to run the listener
// main()

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
    resp.send(`Got ... ${data}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })