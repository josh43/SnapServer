/**
 * Created by neo on 5/26/16.
 */

/* INDEXES
    db.USERS.createIndex({'username':1})

    sue db.USERS.getIndexes() to find indexes

 */

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var theRealDB = null;
var url = 'mongodb://localhost:27017/test';
var connected = false;

// Dont forget to sudo mongod :|||||||
MongoClient.connect(url, function (err, theDB) {
    //insertDocument(db,onComplete);
    if(theDB== null){ // than we are live

        // redhat
        var connection_string = '127.0.0.1:27017/nodejssnap';
        // if OPENSHIFT env variables are present, use the available connection info:
        if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
            connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
                process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
                process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
                process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
                process.env.OPENSHIFT_APP_NAME;
        }


        var connected = false;
        MongoClient.connect('mongodb://'+connection_string, function (err, theDB) {
            assert.equal(null, err);
            //insertDocument(db,onComplete);
            if(theDB== null){
                throw err;
            }
            theRealDB = theDB;
            connected = true;
            console.log("Connected correctly to openshift databse server.");

        });


    }else {
        theRealDB = theDB;
        connected = true;
        console.log("Connected correctly to server.");

    }

});

module.exports.getDB = function(){
    return theRealDB;
}
//module.exports.db;




