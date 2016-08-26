/**
 * Created by neo on 5/26/16.
 */
var db = null;
var getter ={};
var Util = require("./DBUtility");

/*

 */
setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);

/*
 will be used to handle remove requests

 */

getter.login = function(username,password,callback){
    db.collection(Util.USER_COLLECTION).findOne({"username":username,"password":password},function(err,res){
       if(err){
           var toSend = Util.ERROR_MESSAGE;
           toSend.Error = err;
           callback(toSend);
       }else if(res == null){
           var toSend = Util.ERROR_MESSAGE;
           toSend.Error = {"Message":"Bad login User : " + username};
           callback(toSend);
       }else{
           callback(Util.SUCCESS_MESSAGE);
       }
    });
}

/*
 { status: "A" },
 { name: 1, status: 1, "favorites.food": 1 }

 use dot notation for embedded things
 */

getter.find = function(query,callback){
    db.collection(Util.USER_COLLECTION).find(query).limit(5000).toArray(function(err,res){
       callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));

    });
};
getter.findWithProjection = function(query,projection,callback){
    db.collection(Util.USER_COLLECTION).find(query,projection).limit(5000).toArray(function(err,res) {
        callback(Util.handleWith({"Message": "Bad query"}, {"Message": "Nothing found"}, err, res));
    });
};
getter.findOne= function(query,callback){
    db.collection(Util.USER_COLLECTION).findOne(query,function(err,res){
        callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));
    });
};
getter.findOneWithProjection= function(query,projection,callback){
    db.collection(Util.USER_COLLECTION).findOne(query,projection,function(err,res){
        callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));
    });
};
getter.aggregate = function(agg,callback){
    db.collection(Util.USER_COLLECTION).aggregate(agg,function(err,res){
        callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));
    });
};

getter.findFriends = function (regex, callback) {
    db.collection(Util.USER_COLLECTION).find({"username": {$regex: regex}}).limit(50).toArray(function (err, items) {
        if (err) {
            callback(err);
        } else if (items == null) {
            callback({"Error": "could not find other users"});
        } else {

            var names = [];
            for (var i = 0; i < items.length; i++) {
                names.push({"username":items[i].username});
            }
            callback({"Success": names});
        }


    });


};


var thisThenThat = function (thisFunc, thatFunc, names) {
    thisFunc(names);
    thatFunc(names);
}



module.exports = getter;