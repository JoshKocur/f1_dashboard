const connection = require('../connection');
const tables = require('./interface');


function query(QString){
    connection.connect((err)=>{
        if(err){
            throw err
        }

        connection.query(QString, (err, res) =>{
            if(err){
                console.log(err);
            }
            else{
                console.log(res);
            }
        })
    })
}


class Query{
    insertion_params(){
        throw new Error("Must define `insertion_params` in child class!");
    }
}
