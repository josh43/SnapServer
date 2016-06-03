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
module.exports.getGroupItems = function (user, groupName, callback) {
    db.collection("Groups").findOne({"username": user, "gName": groupName}, function (err, res) {
        if (err) {
            callback(err);
        } else if (res == null) {
            callback({"Error": "could not find group"});
        } else {
            callback({"Success": res.items});

        }
    });
}
module.exports.getGroupMembers = function (user, groupName, callback) {
    db.collection("Groups").findOne({"username": user, "gName": groupName}, function (err, res) {
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