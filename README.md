## Installation


### System
```bash

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# source the bashrc
source ~/.bashrc

# install the mysql client
sudo apt install mysql-client-core-8.0

# install the mysql server
sudo apt-get install mysql-server

# Start the server
/etc/init.d/mysql start
```
within the mysql repl..
```bash
CREATE USER 'f1'@'localhost' IDENTIFIED BY 'temp';
CREATE DATABASE f1_db;
GRANT ALL PRIVILEGES ON f1_db TO 'f1'; 

# Ensure you add the following to make a local connection possible
ALTER USER 'f1'@'localhost' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'temp';
# Change the username, host, and password (temp) as needed.
```

### Node 
```bash
nvm use v17
npm i 
```



