/**
 * Created by neo on 5/23/16.
 */
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var db = null;var url = 'mongodb://localhost:27017/Test';
var validKeys = 0;
MongoClient.connect(url, function (err, theDB) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    //insertDocument(db,onComplete);
    db = theDB;
});






module.exports.find = function (coll, q, callback) {
        db.collection("Logins").findOne(q, function (err, result) {
            test.equal(null, err);

            return true;
        });
    }
module.exports.deleteAccount = function ( user, pass, callback) {
    db.collection("Logins").findOneAndDelete({"username": user,"pass":pass}, function (err, res) {
        if (err  != null) {
            callback({"Error": "Unable to delete user"});
        } else {
            if(res.value == null){
                callback({"Error": "user/password does not exist"});
            }else {
                callback({"Success": "deleted user"});
            }
        }
    });
}


module.exports.getAllItemsAndGroups = function (user, callback){
    findUser(user,function(result){
        if(!result["Error"]){
            // parse through info for group
            var groups = [];
            for(var i = 0; i < 20; i++){
                // only return first two
                groups[i] = [];
            }
            for(var groupName in result.groups){

            }

        }else{
            callback({"Error":"could not find user"});
        }
    });
}

module.exports.getGroupContents = function(user, groupName, callback){
    db.collection("Groups")
}
module.exports.changePassword = function ( user, oldPass,newPass,callback) {
    db.collection("Logins").findOneAndUpdate({"username": user,"pass":oldPass},
        {$set : {"pass":newPass} },
        function (err, res) {

            if(err != null){
                callback({"Error": "Bad db"});

            }
            else if (res == null) {
            callback({"Error": "Unable to change password"});
        } else {
                //this search operation should be atomic but it is not
                if(res.value == null){
                    callback({"Error": "Incorrect password"});

                }
                else if(res.value.pass == newPass) {
                    callback({"Success": "new pass : " + newPass});
                }else{
                    callback({"Error": "Incorrect password"});

                }

        }
    });
}
module.exports.findUser = function(user,callback){
     db.collection("Logins").findOne({"username": user}, function (err, res) {
       if(err){
           callback({"Error":err});
       } else if (res == null) {
            callback({"Error": "could not find user"});
        } else {
            callback(res);

        }
    });
}
module.exports.getFriendList = function(user,callback){
    db.collection("Logins").findOne({"username": user}, function (err, res) {
       if(err){
           callback(err);
       } else if (res == null) {
            callback({"Error": "could not find user"});
        } else {
            callback({"FriendList":res.friends});

        }
    });
}
module.exports.getPendingFriends = function(user,callback){
    db.collection("Logins").findOne({"username": user}, function (err, res) {
        if(err) {
            callback(err);
        }else if (res == null) {
            callback({"Error": "could not find user"});
        } else {
            callback({"Pending FriendList":res.pendingF});

        }
    });
}
module.exports.register = function ( user, pass, phone, email, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
            if (res != null) {
                callback({"Error": "User already exists"});
            } else {
                db.collection("Logins").insertOne({
                    "username": user,
                    "pass": pass,
                    "phone": phone,
                    "email": email,
                    "friends": [],
                    "pendingF":[],
                    "groups":[]
                },function(err,r) {
                    if(err != null){
                        callback({"Error": "db interal"});
                    }else if(r.insertedCount  == 1){
                        db.collection("Logins").findOne({"username":user},
                        function(err,succ){
                            callback({"Success": succ._id});

                        });
                    }else {
                        callback({"Error": "Could not create"});
                    }
                });
            }
        });
    }
module.exports.login = function ( user, pass, callback) {
    console.log("Loggin int to db");
        if(db == null){
            console.log("DB WAS NULL\n");        }
        db.collection("Logins").findOne({"username": user,"pass": pass}, function (err, res) {
            if (res == null) {

                callback({"Error": "User not found"});
            } else {
                if (pass != res.pass) {
                    console.log(res);
                    callback({"Error": "Incorrect password"});

                } else {
                    callback({"Success": res._id});

                }
            }
        });
    }
module.exports.createGroup = function ( user, groupName, callback) {
    console.log("Loggin int to db");
    if(db == null){
        console.log("DB WAS NULL\n");        }
    db.collection("Groups").findOne({"username": user,"gName": groupName}, function (err, res) {
        if (res == null) {
// create one
            db.collection("Groups").insertOne({
                "username": user,
                "gName": groupName,
                "items": [],
                "members": [],
                "admins":[],
            },function(err,r) {
                if(err != null){
                    callback({"Error": "db interal"});
                }else if(r.insertedCount  == 1){
                    db.collection("Groups").findOne({"username":user,"gName":groupName},
                        function(err,succ){
                            callback({"Success": succ._id});

                        });
                }else {
                    callback({"Error": "Could not create"});
                }
            });

        } else {
                callback({"Error":"Group already exists"});
        }
    });
}
module.exports.addItemToGroup = function ( user, groupName,item, callback) {

    db.collection("Groups").updateOne({"username": user,"gName": groupName},
        { $addToSet:{"items": {$each: [item]}}},
        function(err, res) {
        if(err) {
            callback({"Error":"DB internal"});

        }else if (res == null) {
                callback({"Error":"Group does not  exist"});

        }else if(res.matchedCount == 1) {
            callback({"Success":"updated the list"});

        }else{
            callback({"Error":"Group does not  exist"});

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

                    if(res == null) {
                        callback({"Error": "Friend not found"});

                    }else{
                        db.collection("Logins").findOneAndUpdate({"username":coolFriend},
                            {$addToSet:{"pendingF":{$each: [user]}}});

                    }
                });
            }

        });
    }

module.exports.acceptFriend = function(user,coolFriend,callback){
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

module.exports.removeFriend = function ( user, unCoolFriend, callback) {
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



