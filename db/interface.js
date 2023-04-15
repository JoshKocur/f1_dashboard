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
                throw new Error(`Missing key(s): ${item}. Required to have all of ${this.required_keys()} for table ${this.name()}`);
            }
        })
        this.record = obj
    }

    name(){
        error();
    }

    required_keys(){
        error();
    }
}
