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

module.exports.removeFriendFromGroup = function (groupID, toRemove,callback) {
    
    db.collection("Logins").findOne({"username":toRemove},function(err,res){
        if(err || res == null){
            callback({"Error":"Unable to remove friend from friend group"});
        }else {
            db.collection("Groups").findOneAndUpdate({"_id": groupID},
                {
                    $pull: {"members": toRemove},
                },
                {
                    returnOriginal: false
                },
                function (err, res) {
                    if (!err) {
                        if (res) {
                            if (res.value != null) {
                                if (res.value.members.length < 1) {
                                    // delete it
                                    console.log("DELETE MEEE\n");
                                    db.collection("Groups").findOneAndDelete({"_id": groupID});

                                }


                                db.collection("Logins").findOneAndUpdate({"username": toRemove},
                                    {$pull: {"groups": {"_id": groupID}}});


                                callback({"Success": "always"});

                            } else {
                                callback({"Error": "Couldnt find member to remove"});

                            }
                        } else {
                            callback({"Error": "Couldnt find member to remove"});

                        }
                    } else {
                        callback({"Error": "Couldnt find member to remove"});
                    }
                });

        }
    });

}
module.exports.addFriendToGroup = function (groupID, newFriend, callback) {

        
    db.collection("Logins").findOne({"username":newFriend},function(err,res)
    {

        if(err){
            callback({"Error":"Couldnt Find User"});
        }else if(res == null){
            callback({"Error":"Couldnt Find User"});
        }else {
            db.collection("Groups").findOneAndUpdate({"_id": groupID},
                {$addToSet: {"members": {$each: [newFriend]}}}
                , {returnNewDocument: true},
                function (err, res) {
                    if (err) {
                        callback(err);
                    } else if (res == null) {
                        callback({"Error": "could not find group"});
                    } else {

                        db.collection("Logins").findOneAndUpdate({"username": newFriend},
                            {$addToSet: {"groups": {"_id": groupID}}}, function (err, res) {
                                if (err) {
                                    // undo insert

                                    this.removeFriendFromGroup(groupID, newFriend, callback);
                                   // callback({"Error":"Failed to add friend to group"});

                                } else {
                                    callback({"Successt": "good job"});
                                }

                            });


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
        if (res == null || err) {
            callback({"Error": "User not found when trying to delete"});
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

module.exports.addItemToGroup = function ( groupID, item, callback) {

    db.collection("Groups").updateOne({"_id":groupID},
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
module.exports.removeItemFromGroup = function (groupID, item, callback) {

    db.collection("Groups").updateOne({"_id":groupID},
        {$pull: {"items": item}},
        function (err, res) {
            if (err) {
                callback({"Error": "DB internal"});

            } else if (res == null) {
                callback({"Error": "Group does not  exist"});

            } else if (res.modifiedCount >= 1) {
                // this doesnt neccessarily mean that it removed something
                callback({"Success": "updated the list"});

            } else {
                callback({"Error": "Item not found"});

            }
        });

}

module.exports.createGroup = function (groupName,userToAdd, callback) {
    console.log("Loggin int to db");
    if (db == null) {
        console.log("DB WAS NULL\n");
    }

// create one
            db.collection("Groups").insertOne({
                "gName": groupName,
                "items": [],
                "members": [],
                "admins": [],
            }, function (err, r) {
                if (err != null) {
                    callback({"Error": "db interal"});
                } else if (r.insertedCount == 1) {
                    // FIX HERE YOU WANT TO PUT THE PERSON WHO CREATED IT IN THE GROUP
                    // ALSO RETURN THE GROUP ID
                    console.log("R.ops._id is " + r.ops[0]._id);
                    db.collection("Groups").findOne({"_id": r.ops[0]._id, "gName": groupName},
                        function (err, succ) {
                            if(succ) {
                                callback({"Success": r.ops[0]._id});
                            }else{
                                callback({"Error":"Failed to create group"});
                            }
                        });
                    //r.insertedId
                    db.collection("Groups").updateOne({"_id": r.ops[0]._id, "gName": groupName},
                        {$addToSet: {"members": {$each: [userToAdd]}}},
                        function (err, succ) {
                            // dont do anything

                        });

                    db.collection("Logins").updateOne({"username":userToAdd},
                        {$addToSet:{"groups":{"_id":r.ops[0]._id}}},
                    function(err,succ){

                    })
                } else {
                    callback({"Error": "Could not create"});
                }
            });


}