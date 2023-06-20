/**
 * Future home of classes to be used to interface with mysql
 * 
 */
const error = () =>{
    throw new Error("Table class is abstract!");
}

class Table {
    constructor(obj){
        if(this.constructor == Table){
            error();
        }
        this.required_keys().forEach(item =>{
            if(!obj.hasOwnProperty(item)){
                throw new TypeError(`Missing key(s): ${item}. Required to have all of ${this.required_keys()} for table ${this.name()}`);
            }
        });
        for (var key in obj){
            this[key] = obj[key];
        }
        this.optional_keys().forEach(item =>{
            if(!this.hasOwnProperty(item)){
                this[item] = null;
            }
        })
        // TODO -- Consider adding a timestamp here. 
    }

    name(){
        error();
    }

    /**
     * Values in this set MUST be present in `this.record`.  If not present `TypeError` will be thrown.
     */
    required_keys(){
        error();
    }

    /**
     * Keys here are to be considered optional and will be assigned a `null` type value if not 
     * present in the object passed into the constructor.
    */
    optional_keys(){
        return Set([])
    }

}


class Session extends Table{
    name(){
        return "Session";
    }
    required_keys(){
        "MeetingKey",
        "MeetingName",
        "MeetingLocation",
        "MeetingCircuit",
        "ArchiveStatus",
        "SessionKey",
        "SessionType",
        "SessionName",
        "SessionStartDateUTC",
        "SessionEndDateUTC",
        "SessionStartDateTimeStamp",
        "SessionGmtOffset"
    }
}


class RaceControlMessage extends Table{
    name(){
        return "RaceControlMessage";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "MessageType",
            "Category", 
            "UTC",
            "Flag",
            "Sector",
            "MSG"
        ])
    }
}

class WeatherData extends Table{
    name(){
        return "WeatherData"
    }
    required_keys(){
        return new Set([
            "SessionId",
            "AirTemp",
            "Humidity",
            "Pressure",
            "Rainfall",
            "TrackTemp",
            "WindSpeed",
            "WindDirection"
        ])
    }
    optional_keys(){
        return new Set([
            "UTC"
        ]);
    }
}

class LapCount extends Table{
    name(){
        return "LapCount";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "CurrentLap",
        ]);
    }
}


class TrackStatus extends Table{
    name(){
        return "TrackStatus";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "TrackStatus",
            "MSG"
        ]);
    }
}


class TimingAppData extends Table{
    name(){
        return "TimingAppData";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "LineNumber"
        ]);
    }
}

class TimingData extends Table{
    name(){
        return "TimingData";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "Sector",
            "Segment",
            "TimingStatus",
        ])
    }
}


class TimingStatsST extends Table{
    name(){
        return "TimingStats";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "Position",
            "StatValue"
        ]);
    }
}

class TimingStats extends Table{
    name(){
        return "TimingStatsST";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "PersonalBestLapNumber",
            "PersonalBestPosition",
            "PersonalBestLapValue",
            "BestSpeedsFLPosition",
            "BestSpeedsFLValue"
        ]);
    }
}

class CarData extends Table{
    name(){
        return "CarData";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "RPM",
            "Speed",
            "Great",
            "Throttle",
            "DRS",
            "Breaks",
            "UTC"
        ]);
    }
}

class DriverData extends Table{
    name(){
        return "DriverData";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "DriverNumber",
            "StatusType",
            "X",
            "Y",
            "Z",
            "UTC"
        ])
    }
}

class DriverList extends Table{
    name(){
        return "DriverList";
    }
    required_keys(){
        return new Set([
           "SessionId",
           "DriverNumber",
           "LineNumber", 
        ]);
    }
}

class SessionData extends Table{
    name(){
        return "SessionData";
    }
    required_keys(){
        return new Set([
        "SessionId",
        "TrackStatus",
        "StatusSeries"
        ]);
    }
}

// export every Table in "namespace" for ease of use
name_space = {
    "Session": Session,
    "RaceControlMessage": RaceControlMessage,
    "WeatherData": WeatherData,
    "LapCount": LapCount,
    "TrackStatus": TrackStatus,
    "TimingAppData": TimingAppData,
    "TimingData": TimingData,
    "DriverList": DriverList,
    "DriverData": DriverData,
    "TimingStatsST": TimingStatsST,
    "TimingStats": TimingStats,
    "RaceControlMessage": RaceControlMessage,
    "CarData": CarData,
    "DriverData": DriverData,
    "DriverList": DriverList,
    "TrackStatus": TrackStatus,
    "SessionData": SessionData,
};

module.exports=name_space;