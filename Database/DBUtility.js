/**
 * Created by neo on 5/23/16.
 */
var assert = require('assert');
require("./DBConnection").getDB();


/*
var tdb = require('./DBConnection').db;
var url = 'mongodb://localhost:27017/Test';

*/


//var db = require('./DBConnection').getDB();

var db = null;
/*


 */
setTimeout(function(){
    db = require("./DBConnection").getDB();
},4000);



/*
Basic things ling creation account deleting, chaning password, 

 */
var noPendingAction = 0;
var friendRequest = 1;
var newItem = 1 << 1;
var itemAndFriend = friendRequest | newItem;

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
module.exports.register = function ( user, pass, phone, email, callback) {
    db.collection("Logins").findOne({"username": user}, function (err, res) {
            if (res != null) {
                callback({"Error": "User already exists"});
            } else {
                /*
                in the action store I will keep things like
                // you figure it out
                // or some bullshit
                {"Items added":{"Group":items}
                 {"Items removed":{"Group":items}
                 */
                db.collection("Logins").insertOne({
                    "username": user,
                    "pass": pass,
                    "phone": phone,
                    "email": email,
                    "friends": [],
                    "pendingF":[],
                    "groups":[],
                    "pendingActions":noPendingAction, // can either be 0 for nothing 1 for friend reqest 2 for new item or 3 for both
                    "actionStore":[]
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

                callback({"Error": "User nad password combo not found"});
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









