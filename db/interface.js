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
            "Message"
            // TimeStamp
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
            "RainFall",
            "TrackTemp",
            "WindSpeed",
            "WindDirection"
            // TimeStamp
        ])
    }
    optional_keys(){
        return new Set([
            "UTC"
        ]);
    }
}

class TrackStatus{
    name(){
        return "TrackStatus";
    }
    required_keys(){
        return new Set([
            "SessionId",
            "Status",
            "Message"
            // _kf???
        ]);
    }
}


class SessionData{
    name(){
        return "SessionData";
    }
    required_keys(){
        "SessionId",
        "TrackStatus",
        "StatusSeries"
        // TimeStamp??? 
    }
}

// export every Table in "namespace" for ease of use
name_space = {
    "WeatherData": WeatherData,
    "RaceControlMessage": RaceControlMessage,
    "TrackStatus": TrackStatus,
    "SessionData": SessionData,
};

module.exports=name_space;