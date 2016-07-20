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
getter.getRequest = function(theRequest,callback) {


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
}
getter.findWithProjection = function(query,projection,callback){
    db.collection(Util.USER_COLLECTION).find(query,projection).limit(5000).toArray(function(err,res) {
        callback(Util.handleWith({"Message": "Bad query"}, {"Message": "Nothing found"}, err, res));
    });
}
getter.findOne= function(query,callback){
    db.collection(Util.USER_COLLECTION).findOne(query,function(err,res){
        callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));
    });
}
getter.findOneWithProjection= function(query,projection,callback){
    db.collection(Util.USER_COLLECTION).findOne(query,projection,function(err,res){
        callback(Util.handleWith({"Message":"Bad query"},{"Message":"Nothing found"},err,res));
    });
}
getter.getFriendList = function (user, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find user"});
        } else {
            callback({"Success": res.friends});

        }
    });
}
getter.getUserInfo = function(username,callback){
    db.collection("Logins").findOne({"username": username}, function (err, res) {
       if(err){
           callback({"Error":"bad get user info req"});
       }
        if (res == null) {
            callback({"Error": "User not found"});
        } else {
            callback(res);
        }

    });
}
getter.getGroupInfo = function(groupID,callback){
    db.collection("Groups").findOne({"_id": groupID}, function (err, res) {
        if(err){
            callback({"Error":"bad get group info req"});
        }
        if (res == null) {
            callback({"Error": "Group not found"});
        } else {
            callback(res);
        }

    });
}
getter.getGroupNames = function(user,callback){
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find group"});
        } else {
            callback({"Success": res.groups});

        }
    });
}
getter.getGroupItems = function ( groupID, callback) {
    db.collection("Groups").findOne({"_id":groupID}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find group"});
        } else {
            callback({"Success": res.items});

        }
    });
}
getter.getGroupMembers = function (groupID, callback) {
    db.collection("Groups").findOne({"_id":groupID}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find group"});
        } else {
            callback({"Success": res.members});

        }
    });
}
getter.getPendingFriends = function (user, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find user"});
        } else {
            callback({"Pending FriendList": res.pendingF});

        }
    });
}
var thisThenThat = function (thisFunc, thatFunc, names) {
    thisFunc(names);
    thatFunc(names);
}

getter.findFriends = function (regex, callback) {
    db.collection("Logins").find({"username": {$regex: regex}}).limit(45).toArray(function (err, items) {
        if (err) {
            callback(err);
        } else if (items == null) {
            callback({"Error": "could not find other users"});
        } else {
            // dont you love node js its like so awesome essay
            // maybe its asynch who the hell knows that would suck
            var names = [];
            for (var i = 0; i < items.length; i++) {
                names.push(items[i].username);
            }
            callback({"Success": names});
        }


    });


}

module.exports = getter;