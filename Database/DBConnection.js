/**
 * Created by neo on 5/26/16.
 */

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var theRealDB = null;
var url = 'mongodb://localhost:27017/Test';
var connected = false;
MongoClient.connect(url, function (err, theDB) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    //insertDocument(db,onComplete);
    if(theDB== null){
        throw err;
    }
    theRealDB = theDB;
    connected = true;

});

module.exports.getDB = function(){
    return theRealDB;
}
//module.exports.db;




