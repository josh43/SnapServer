/**
 * Created by neo on 5/26/16.
 */

var Util = require('./DBUtility')
var db = null;
var setter = {};
/*

 */

setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);


setter.setRequest = function(theRequqest,error){

};
/*

the thing about this is that it will silently fail NOOOO
because there is no way to do things like

collection.updateMany({a:1}, {$set:{b:0}}, o, function(err, r) {
    test.equal(null, err);
    test.equal(2, r.result.n);
 */

setter.update = function(query,update,callback){
    db.collection(Util.USER_COLLECTION).updateMany(query,update,function(err,res){
                callback(Util.handleWith({"Error":"Couldn't update"},{"Error":"Couldn't update"},err,res));
    });
};
setter.updateOne = function(query,update,callback){
    db.collection(Util.USER_COLLECTION).updateOne(query,update,function(err,res){
        callback(Util.handleWith({"Error":"Couldn't update"},{"Error":"Couldn't update"},err,res));
    });
};


module.exports = setter;