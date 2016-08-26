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
var toExport = module.exports = {};

// BEGIN BASIC CONSTANTS
toExport.MUTUAL_FRIENDS = 1;
toExport.THEY_ADDED_ME = 2;
toExport.I_ADDED_THEM = 3;
toExport.NOT_FRIENDS = 4;
toExport.IGNORE = 5;

toExport.RECEIVED_SNAP = 1;
toExport.WAS_REMOVED_FROM_FRIENDLIST = 2;
toExport.USER_DELETED_STORY = 3;
toExport.FRIEND_CONFIRMED = 4;
toExport.FRIEND_NOTIFICATION = 4;


toExport.USER_COLLECTION = "USERS";

toExport.SUCCESS_MESSAGE = {"Success":"YAY"};
toExport.ERROR_MESSAGE = {"Error":{}};
toExport.STANDARD_ERROR_MESSAGE = {"Error":{"Message":"Something went wrong :("}};

// because objective c's dynamic dispatch you can actually interpret these commands
// as methods without doing anything special
// if(Command){
// [self Command.action]
// } // muhahahahahahahaha!
toExport.ACTION_MESSAGE = {"Command":{"type":-1,"action":{}}};
toExport.REMOVE_SNAP = 1;

toExport.createErrorMessage = function(msg){
    var toReturn = toExport.ERROR_MESSAGE;
    toReturn.Error = {"Message":msg};
    return toReturn;
};
toExport.removeAction = function(snapID){
    var builder = toExport.ACTION_MESSAGE;
    builder.type = toExport.REMOVE_SNAP;
    builder.action = {"Method":"removeSnapWithID","snapID":snapID};
    return builder;
};
toExport.addFriendAction = function(username){
    var builder = toExport.ACTION_MESSAGE;
    builder.type = toExport.THEY_ADDED_ME;
    builder.action = {"Method":"friendAddedMe","username":username};
    return builder;
};
// END BASIC CONSTANTS

// COOOKIE CUTTER IF STATEMENT
toExport.handleWith = function(errMessage,resNullMessage,err,res){
    var toSend;
    if(err){
        toSend = this.ERROR_MESSAGE;
        var builder = {"ErrorReport":err,"Message":errMessage};
        toSend.Error = builder;
    }else if(res == null){
        toSend = this.ERROR_MESSAGE;
        toSend.Error = resNullMessage;
    }else{
        toSend = res;
    }

    return toSend;
};

toExport.helper = function(res,shouldMatch,onError,onSuccess) {
    if (!(res.Error)) {
        if ((res.matchedCount == shouldMatch) && ((res.upsertedCount + res.modifiedCount) >= shouldMatch)) {
            onSuccess(res);
        } else {
            onError(res);
        }
    } else {
        onError(res);
    }
};
// END COOOKIE CUTTER

// BEGIN SCHEMA CREATORS
toExport.createUser = function(){
    return {
        'username':"",
        'firstName':"",
        'lastName':"",
        'password':"",
        'email':"",
        'snapchats':[],
        'story':[],
        'lastStoryUpdate':new Date(),
        'friendList':[],
        'actionList':[]
    };

};


toExport.createFriend = function(friendName,friendType){
    if(typeof(friendName) !== 'string'){
        console.log("You are incorrectly creating a friend!")
    }
    return {
        'username':friendName,
        'friendType':friendType
            };
};
toExport.createAction = function(actionType,withAction){

    return {
        'Command': {
            'type': actionType,
            'action': withAction
        }
    };
};
toExport.createSnap = function(snapID){

    return {
        'snapID':snapID
    };
};

// BEGIN SCHEMA CREATORS
toExport.deleteAccount = function ( user, pass, callback) {
    db.collection(toExport.USER_COLLECTION).findOneAndDelete({"username": user,"pass":pass}, function (err, res) {
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
};

toExport.changePassword = function ( user, oldPass,newPass,callback) {
    db.collection(toExport.USER_COLLECTION).findOneAndUpdate({"username": user,"pass":oldPass},
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
};
toExport.register = function (userInfo,callback) {

    db.collection(toExport.USER_COLLECTION).findOne({"username": userInfo.username}, function (err, res) {
            if (res != null) {
                callback({"Error": {"Message":"User already exists"}});
            } else if(err){
                callback({"Error": {"Message":"There was an error registering"}});
            }else{
                // than actualy insert
                db.collection(toExport.USER_COLLECTION).insertOne(userInfo,function(err,res){
                    if(res.insertedCount != 1){
                        var builder = this.ERROR_MESSAGE;
                        builder.Error = {"Message":"unable to insert 1 res.insertedCount != 1"};
                        callback(builder);
                    }else {
                        db.collection(toExport.USER_COLLECTION).findOne({"username":userInfo.username},function(err,res){
                            callback(
                                toExport.handleWith(
                                    {"Message":"Although It was inserted, i was unable to retrieve.."},
                                     {"Message":"Although It was inserted, i was unable to retrieve.."},
                                     err,res)
                            );
                        });

                    }
                })
            }
        });
};
toExport.login = function ( user, pass, callback) {
    console.log("Loggin int to db");
        if(db == null){
            console.log("DB WAS NULL\n");        }
        db.collection(toExport.USER_COLLECTION).findOne({"username": user,"pass": pass}, function (err, res) {
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
};









