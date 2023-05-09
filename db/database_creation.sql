CREATE TABLE Session(
       SessionId INT NOT NULL AUTO_INCREMENT, 
       MeetingKey INT NOT NULL,
       MeetingName VARCHAR(100),
       MeetingLocation VARCHAR(100),
       MeetingCountry VARCHAR(25),
       MeetingCircuit VARCHAR(25),
       ArchiveStatus VARCHAR(25),
       SessionKey INT NOT NULL,
       SessionType VARCHAR(25),
       SessionName VARCHAR(100),
       SessionStartDateUTC VARCHAR(100),
       SessionEndDateUTC VARCHAR(20),
       SessionStartDateTimeStamp TIMESTAMP,
       SessionGmtOffset VARCHAR(100),
       PRIMARY KEY (SessionId)
);

CREATE TABLE WeatherData(
       SessionId INT NOT NULL,
       WeatherDataId INT NOT NULL AUTO_INCREMENT,
       AirTemp FLOAT,
       Humidity FLOAT,
       Pressure FLOAT,
       RainFall FLOAT,
       TrackTemp FLOAT,
       WindSpeed FLOAT,
       WindDirection FLOAT,
       PRIMARY KEY ( WeatherDataId ),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId)
);

CREATE TABLE TrackStatus(
       SessionId INT NOT NULL,
       TrackStatus INT NOT NULL AUTO_INCREMENT,
       Status VARCHAR(2),
       Message VARCHAR(20),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (TrackStatus)
);


CREATE TABLE RaceControlMessages(
       SessionId INT NOT NULL,
       RaceControlMessagesId INT NOT NULL AUTO_INCREMENT,
       TYPE VARCHAR(2),
       UTC VARCHAR(20),
       Category VARCHAR(20),
       Flag VARCHAR(25),
       Sector INT,
       Message VARCHAR(50),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (RaceControlMessagesId)
);

CREATE TABLE CarData(
       SessionID INT NOT NULL, 
       CarDataId INT NOT NULL AUTO_INCREMENT,
       DriverNumber VARCHAR(3) NOT NULL,
       RPM INT,
       Speed INT,
       Gear INT,
       Throttle INT,
       DRS INT,
       Breaks INT,
       UTC VARCHAR(20),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (CarDataId)
);

CREATE TABLE DriverData(
       SessionId INT NOT NULL,
       DriverDataId INT NOT NULL AUTO_INCREMENT,
       DriverNumber VARCHAR(3) NOT NULL,
       StatusType VARCHAR(15),
       X INT,
       Y INT,
       Z INT,
       UTC VARCHAR(20),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (DriverDataId)
);

CREATE TABLE DriverList(
       SessionId INT NOT NULL,
       DriverListId INT NOT NULL,
       DriverNumber VARCHAR(3) NOT NULL,
       LineNumber INT, 
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (DriverListId)

);

CREATE TABLE LapCount(
       SessionId INT NOT NUlL,
       CurrentLapId INT NOT NULL,
       CurrentLap INT NOT NULL,
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY(CurrentLapId)
);

CREATE TABLE TimingData(
       SessionId INT NOT NULL,
       TimingDataId INT NOT NULL,
       DriverNumber VARCHAR(3) NOT NULL,
       Sector VARCHAR(3),
       Segment VARCHAR(3),
       Status VARCHAR(5),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (TimingDataId)
);

CREATE TABLE TimingStatus(
       SessionId INT NOT NULL,
       TimingStatusId INT NOT NULL,
       DriverNumber VARCHAR(3) NOT NULL,
       Position INT,
       Value VARCHAR(3),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (TimingStatusId)
);

CREATE TABLE TimingAppData (
    SessionId INT NOT NULL,
    TimingAppData INT NOT NULL,
    DriverNumber VARCHAR(3) NOT NULL,
    LineNumber INT,
    FOREIGN KEY (SessionId)
        REFERENCES Session (SessionId),
    PRIMARY KEY (TimingAppData)
);

CREATE TABLE SessionData(
       SessionId INT NOT NULL,
       SessionDataId INT NOT NULL,
       TrackStatus VARCHAR(25),
       UTC VARCHAR(20),
       FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
       PRIMARY KEY (SessionData)
)