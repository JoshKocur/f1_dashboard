const connection = require('./connection');

function Query(QString){
    connection.connect((err)=>{
        if(err){
            throw err
        }
        console.log(QString)
        connection.query(QString, (err, res) =>{
            if(err){
                console.log(err);
            }
            else{
                console.log(res);
            }
        })
        connection.end();
    })
}


class TableQuery{
    insertion_params(record){
        throw new Error("Must define `insertion_params` in child class!");
    }
    insert(record){
        let QString = this.insertion_params(record)
        return Query(QString);
    }
}


class SessionQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO Session (MeetingKey, MeetingName, MeetingLocation, MeetingCircuit, ArchiveStatus, SessionKey, SessionType, SessionName, SessionStartDateUTC, SessionEndDateUTC, SessionStartDateTimeStamp,SessionGmtOffset VALUES
            (
                ${record.MeetingKey}, 
                ${record.MeetingName}, 
                ${record.MeetingLocation}, 
                ${record.MeetingCircuit}, 
                ${record.ArchiveStatus}, 
                ${record.SessionKey}, 
                ${record.SessionType}, 
                ${record.SessionName}
                ${record.SessionStartDateUTC},
                ${record.SessionEndDateUTC},
                ${record.SessionGmtOffset})`;
    }
}


class WeatherDataQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO WeatherData (SessionId, AirTemp, Humidity, Pressure, RainFall, TrackTemp, WindSpeed, WindDirection) VALUES 
            (${record.SessionId}, ${record.AirTemp}, ${record.Humidity}, ${record.Pressure}, ${record.RainFall}, ${record.TrackTemp}, ${record.WindSpeed}, ${record.WindSpeed})`;
    }
}
