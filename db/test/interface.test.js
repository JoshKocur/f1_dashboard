const db_interface = require('../interface');

let obj = {}
let obj2 = {
    "session_id": "",
    "AirTemp": " ",
    "Humidity": " ",
    "Pressure": "",
    "RainFall": "",
    "TrackTemp": "", 
    "WindSpeed": "",
    "WindDirection": ""
}

test("Ensure empty object fails key validation", ()=> {
    const test = () => {
        var _ = new db_interface.WeatherData(obj)
    }
    expect(test).toThrow(TypeError);
})

test("Ensure successful creation for valid obj", () =>{
    var record = new db_interface.WeatherData(obj2);
    expect(record.name()).toBe("WeatherData");
})
