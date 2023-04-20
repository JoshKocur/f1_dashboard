const connection = require('../connection');


let sampleRecord = {
    "SessionId": 0,
    "AirTemp": 1.3,
    "Humidity": 1.2,
    "Pressure": 1.1,
    "RainFall": 1.0,
    "TrackTemp": 0.1, 
    "WindSpeed": 235,
    "WindDirection": 123123
}
const QString = "INSERT INTO WeatherData (SessionId, AirTemp, Humidity, Pressure, RainFall, TrackTemp, WindSpeed, WindDirection) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";


connection.connect((err)=>{
    if(err){
        throw err
    }
    connection.query(QString, [sampleRecord.SessionId, sampleRecord.AirTemp, sampleRecord.Humidity, 
        sampleRecord.Pressure, sampleRecord.RainFall, sampleRecord.TrackTemp, sampleRecord.WindSpeed, sampleRecord.WindDirection], (err, res) =>{
            if(err){
                throw(err)
            }
            else{
                console.log(res);
        }
        )
})
