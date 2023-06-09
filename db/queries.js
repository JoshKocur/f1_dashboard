const connection = require('./connection');

function Query(QString){
    connection.query(QString, (err, res) =>{
        if(err){
            console.log(err);
        }
    })
}

class TableQuery{
    tableName(){
        throw new Error("Must define tablename");
    }
    idKey(){
        return this.tableName() + "Id";
    } 
    insertion_params(record){
        throw new Error("Must define `insertion_params` in child class!");
    }
    insert(record){
        let QString = this.insertion_params(record)
        return Query(QString);
    }
    getBasedOnTerm(field, value){
        let QString = `SELECT * FROM ${this.tableName()} WHERE ${field}=${value}`;
        return Query(QString);
    }
    getBasedOnId(id){
        return this.getBasedOnTerm(this.idKey(), id);
    }
}


class SessionQuery extends TableQuery{
    tableName(){
        return "Session";
    }
    insertion_params(record){
        return `INSERT INTO Session VALUES (${record.MeetingKey}, ${record.MeetingName}, ${record.MeetingLocation}, ${record.MeetingCountry}, ${record.MeetingCircuit}, ${record.ArchiveStatus}, ${record.SessionKey}, ${record.SessionType}, ${record.SessionName}, ${record.SessionStartDateUTC},${record.SessionEndDateUTC}, ${record.SessionStartDateTimeStamp}, ${record.SessionGmtOffset})`;
    }
}



class WeatherDataQuery extends TableQuery{
    tableName(){
        return "WeatherData";
    }
    insertion_params(record){
        return `INSERT INTO WeatherData (SessionId, AirTemp, Humidity, Pressure, RainFall, TrackTemp, WindSpeed, WindDirection) VALUES 
            (${record.SessionId}, ${record.AirTemp}, ${record.Humidity}, ${record.Pressure}, ${record.Rainfall}, ${record.TrackTemp}, ${record.WindSpeed}, ${record.WindSpeed})`;
    }
}

class TrackStatusQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO TrackStatus (SessionId, TrackStatus, MSG) VALUES (${record.SessionId}, ${record.TrackStatus}, ${record.MSG})`;  
    }
}

class RaceControlMessagesQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO RaceControlMessages (SessionId, MessageType, UTC, Category, Flag, Scope, Sector, MSG) VALUES
          (${record.SessionId}, 
            ${record.MessageType}, 
            ${record.UTC}, 
            ${record.Category}, 
            ${record.Flag}, 
            ${record.Scope}, 
            ${record.Sector}, 
            ${record.MSG})`;
    }
}

class CarDataQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO CarData (SessionId, DriverNumber, RPM, Speed, Gear, Throttle, DRS, Breaks, UTC) VALUES(${record.SessionId},
             ${record.DriverNumber},
             ${record.RPM},
             ${record.Speed},
             ${record.Gear},
             ${record.Throttle},
             ${record.DRS},
             ${record.Breaks},
            "${record.UTC}")`;
    }
}

class DriverDataQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO DriverData (SessionId, DriverNumber, StatusType, X, Y, Z, UTC) VALUES(${record.SessionId}, ${record.DriverNumber},"${record.StatusType}", ${record.X},${record.Y},${record.Z},"${record.UTC}")`;
    }
}


class DriverListQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO DriverList (SessionId, DriverNumber, LineNumber) VALUES
            (${record.SessionId},
             ${record.DriverNumber},
             ${record.LineNumber})`;
    }
}


class LapCountQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO LapCount (SessionId, CurrentLap) VALUES
            (${record.SessionId},
             ${record.CurrentLap});`
    }
}


class TimingDataQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO TimingData (SessionId, DriverNumber, Sector, Segment, TimingStatus) VALUES
            (${record.DriverNumber},
             ${record.Sector},
             ${record.Segment},
             ${record.TimingSatus})`;
    }
}


class TimingStatsSTQuery extends TableQuery{
    insertion_params(record){
        return `INSERT INTO TimingStats (SessionId, DriverNumber, PersonalBestLapNumber, PersonalBestPosition, PersonalBestLapValue, BestSpeedsFLPosition, BestSpeedsFLValue) VALUES
            ($(record.DriverNumber)) 
        `;
    }
}

module.exports = {
    "Session": SessionQuery,
    "Query": Query,
    "WeatherData": WeatherDataQuery,
    "CarData": CarDataQuery,
    "DriverData": DriverDataQuery
}