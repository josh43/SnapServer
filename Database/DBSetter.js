/**
 * Created by neo on 5/26/16.
 */
var db = null;
/*

 */

setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);

/* BASIC PRO SCHEMA RIIIGHT>AS>ADSDASD>ASD ASJKDFASKDFJ
 db.collection("Groups").insertOne({
 "username": user,
 "gName": groupName,
 "items": [],
 "members": [],
 "admins":[],
 }

 */

module.exports.removeFriendFromGroup = function (user, groupName, toRemove,callback) {
    db.collection("Groups").findOneAndUpdate({"username": user, "gName": groupName},
        {
            $pull: {"members": toRemove},
        },
        {
            returnOriginal: false
        },
        function(err,res){
            if(!err) {
                if (res) {
                    if (res.value != null) {
                        if (res.value.members.length < 1) {
                            // delete it
                            console.log("DELETE MEEE\n");
                            db.collection("Groups").findOneAndDelete({"username": user, "gName": groupName});

                        }


                    db.collection("Logins").findOneAndUpdate({"username": toRemove},
                        {$pull: {"groups": {"username": user, "groupName": groupName}}});


                    callback({"Success": "always"});

                    }else{
                        callback({"Error":"Couldnt find member to remove"});

                    }
                }else{
                    callback({"Error":"Couldnt find member to remove"});

                }
            }else{
                callback({"Error":"Couldnt find member to remove"});
            }
        });




}
module.exports.addFriendToGroup = function (theUser, groupName, newFriend, callback) {


                    db.collection("Groups").findOneAndUpdate({"username": theUser, "gName": groupName},
                        {$addToSet: {"members": {$each: [newFriend]}}}
                        , {returnNewDocument: true},
                        function (err, res) {
                            if (err) {
                                callback(err);
                            } else if (res == null) {
                                callback({"Error": "could not find group"});
                            } else {
                                // doesnt do much
                                
                                db.collection("Logins").findOneAndUpdate({"username": newFriend},
                                    {$addToSet: {"groups": {"username":theUser,"groupName":groupName}}}, function (err, res) {
                                        if (err) {
                                            // undo insert

                                            this.removeFriendFromGroup(newFriend, groupName);
                                            callback({"Error": "could not add to group"});
                                        } else {
                                            callback({"Successt": "good job"});
                                        }

                                    });


                            }
                        });

          

}
module.exports.addFriend = function (user, coolFriend, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if (res == null) {
            callback({"Error": "User not found"});
        } else {
            //{ $addToSet: { "friends": { $each: [coolFriend] } } }
            db.collection("Logins").findOne({"username": coolFriend}, function (err, res) {

                if (res == null) {
                    callback({"Error": "Friend not found"});

                } else {
                    db.collection("Logins").findOneAndUpdate({"username": coolFriend},
                        {$addToSet: {"pendingF": {$each: [user]}}});

                }
            });
        }

    });
}
module.exports.acceptFriend = function (user, coolFriend, callback) {
    db.collection("Logins").update(
        {"username": user},
        {$pull: {"pendingF": {$each: [coolFriend]}}},
        function (err, doc) {
            if (err) {
                callback({"Error": "Did not add friend properly"});
                return;

            }
        });

    db.collection("Logins").update(
        {"username": user},
        {$addToSet: {"friends": {$each: [coolFriend]}}},
        function (err, doc) {
            if (err) {
                // undo last op
                db.collection("Logins").update(
                    {"username": user},
                    {$addToSet: {"pendingF": {$each: [coolFriend]}}},
                    function (err, doc) {
                        if (err) {
                            callback({"Error": "Did not add friend properly"});
                            return;

                        }
                    });

                callback({"Error": "Did not add friend properly"});

            }
        });

    db.collection("Logins").update(
        {"username": coolFriend},
        {$addToSet: {"friends": {$each: [user]}}},
        function (err, doc) {
            if (err) {
                // undo last two ops
                db.collection("Logins").update(
                    {"username": user},
                    {$addToSet: {"pendingF": {$each: [coolFriend]}}});


                db.collection("Logins").update(
                    {"username": coolFriend},
                    {$pull: {"friends": {$each: [coolFriend]}}});


                callback({"Error": "Did not add friend properly"});

            } else {
                callback({"Success": "Added friend"});

            }
        });
}
module.exports.removeFriend = function (user, unCoolFriend, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if (res == null) {
            callback({"Error": "User not found"});
        } else {
            //{ $addToSet: { "friends": { $each: [coolFriend] } } }

            db.collection("Logins").update(
                {"user": user},
                {$pull: {"friends": {$each: [unCoolFriend]}}},
                function (err, doc) {
                    if (err) {
                        callback({"Error": "Did not delete friend properly"});

                    } else {
                        callback({"Success": "Deleted friend"});

                    }
                });

        }

    });

}

module.exports.addItemToGroup = function (user, groupName, item, callback) {

    db.collection("Groups").updateOne({"username": user, "gName": groupName},
        {$addToSet: {"items": {$each: [item]}}},
        function (err, res) {
            if (err) {
                callback({"Error": "DB internal"});

            } else if (res == null) {
                callback({"Error": "Group does not  exist"});

            } else if (res.matchedCount == 1) {
                callback({"Success": "updated the list"});

            } else {
                callback({"Error": "Group does not  exist"});

            }
        });

}
module.exports.removeItemFromGroup = function (user, groupName, item, callback) {

    db.collection("Groups").updateOne({"username": user, "gName": groupName},
        {$pull: {"items": item}},
        function (err, res) {
            if (err) {
                callback({"Error": "DB internal"});

            } else if (res == null) {
                callback({"Error": "Group does not  exist"});

            } else if (res.matchedCount == 1) {
                callback({"Success": "updated the list"});

            } else {
                callback({"Error": "Group does not  exist"});

            }
        });

}
module.exports.createGroup = function (user, groupName, callback) {
    console.log("Loggin int to db");
    if (db == null) {
        console.log("DB WAS NULL\n");
    }
    db.collection("Groups").findOne({"username": user, "gName": groupName}, function (err, res) {
        if (res == null) {
// create one
            db.collection("Groups").insertOne({
                "username": user,
                "gName": groupName,
                "items": [],
                "members": [],
                "admins": [],
            }, function (err, r) {
                if (err != null) {
                    callback({"Error": "db interal"});
                } else if (r.insertedCount == 1) {
                    db.collection("Groups").findOne({"username": user, "gName": groupName},
                        function (err, succ) {
                            callback({"Success": succ._id});

                        });
                    db.collection("Groups").updateOne({"username": user, "gName": groupName},
                        {$addToSet: {"members": {$each: [user]}}},
                        function (err, succ) {
                            // dont do anything

                        });
                } else {
                    callback({"Error": "Could not create"});
                }
            });

        } else {
            callback({"Error": "Group already exists"});
        }
    });
}