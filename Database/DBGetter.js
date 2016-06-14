/**
 * Created by neo on 5/26/16.
 */
var db = null;

/*

 */
setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);


module.exports.getFriendList = function (user, callback) {
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
module.exports.getUserInfo = function(username,callback){
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
module.exports.getGroupInfo = function(groupID,callback){
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
module.exports.getGroupNames = function(user,callback){
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
module.exports.getGroupItems = function ( groupID, callback) {
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
module.exports.getGroupMembers = function (groupID, callback) {
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
module.exports.getPendingFriends = function (user, callback) {
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

module.exports.findFriends = function (regex, callback) {
    db.collection("Logins").find({"username": {$regex: regex}}).limit(15).toArray(function (err, items) {
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