/**
 * Created by neo on 7/18/16.
 */
var express = require('express');
var router = express.Router();
var Util = require("../Database/DBUtility");
var Getter = require("../Database/DBGetter");
var Setter = require("../Database/DBSetter");
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var PictureBase = require("../Database/PictureBase");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var Validater = require('./Validater')

//@wiki
// The POST method requests that the server accept the entity enclosed
// in the request as a new subordinate of the web resource identified by the URI.
// The data POSTed might be, for example, an annotation for existing resources; a message for
// a bulletin board, newsgroup, mailing list, or comment thread;
// a block of data that is the result of submitting a web form to a
// data-handling process; or an item to add to a database.[14]
// curl -X POST http://localhost:3000/helloPost

/*
    PERSONAL_SNAPS ARE SETUP LIKE EMAILS
    STORY_SNAPS are PUBLISH/SUBSCRIBE
 */

//BEGIN HELPER FUNCTIONS
router.updateUserSnapInbox = function(user,owner,objectID){
    var filter = {"username":user};
    var snap = Util.createSnap(objectID);
    var update = {$addToSet:{"snapchats":snap}};
    Setter.updateOne(filter,update,function(res){

        Util.helper(res,1,
            function (err) {
                console.log("Failed to place the message in the users inbox :(");
                // dont have t o do anything thooo
            }, function (success) {
                console.log("Successfuly placed the message in the users inbox!");
                PictureBase.updatePictureInfo(objectID,{$addToSet:{"metadata.sentTo":user}},function(result){
                   Util.helper(result,
                   function(err){
                       var undoUpdate = {$pull:{"snapchats":snap}};
                       Setter.updateOne(filter, undoUpdate, function (x) {
                       });
                       PictureBase.updatePictureInfo(objectID,{pull:{"metadata.sentTo":user}},function(result) {
                       });
                           },
                   function(finalResult){

                   });
                });
            }
        );
        /*
            if(!(res.Error)){
                if(res.matchedCount && (res.upsertedCount || res.modifiedCount)) {
                    // than update the gridfs
                    PictureBase.snapWasSentTo(objectID, user, function (result) {
                        if (result.Error) {
                            // undo everything
                            var undoUpdate = {};
                            Setter.updateOne(filter, undoUpdate, function (x) {
                            });
                        }
                    });
                }else{
                    console.log("Couldn't find user!! to update snap INbox");
                }
            }else{
                console.log("Couldn't find user!! to update snap INbox");
            }
            */
    });

};

// remember to update lastStoryUpdate with the date field
router.updateUserSnapStory = function(owner,snapID,date,callback) {
    var filter = {"username": owner};
    var snap = Util.createSnap(snapID);
    var update = {
                    $addToSet: {"story": snap},
                    $max: {"lastStoryUpdate": date}
                };
    Setter.updateOne(filter, update, function (result) {

        Util.helper(result, 1,
            function (errRes) {
                var builder = Util.ERROR_MESSAGE;
                builder.Error = {"Message": "Failed to update the story :(   " + errRes.message};
                Setter.updateOne(filter,{$pull: {"story": snap}},function(x,y){});
                callback(builder);
            },
            function (successRes) {
                var builder = {"Success": snapID};
                callback(builder);
            });

    });
};
//END HELPER FUNCTIONS

// BEGIN POST METHODS
router.post("/sendSnap",upload.single("contentFile"), function (req, res) {
    //curl -F "contentFile=@./images/sky.jpg" -F "name=sky.jpg" -F "userList={\"users\":[\"stefan\",\"miguel\",\"berneaseMountainDog\"]}" -F "info={\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}" http://localhost:3000/sendSnap


    var info = req.body.info;
    var theArr = JSON.parse(req.body.userList);
    if(typeof(info) !== 'object'){
        info = JSON.parse(info);
    }
    var owner = info.owner;

    //var userList = req.body.userList;
    var path = req.file.path;

    //info = {\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}
    PictureBase.uploadPictureFrom(path,owner,info,function(data){
        if(data.Success){
            // proceed to step too and actually update every friends inbox
            var size = theArr.users.length;

            res.send({"Success":{"_id":data.Success}});
            // go and update all other hthings
            for(var i = 0; i < theArr.users.length; i++){
                //theArr.users[i]);
                // data.Success == Object id
                console.log("sending to user " + theArr.users[i]);
                module.exports.updateUserSnapInbox(theArr.users[i],owner,data.Success);
            }
        }else {
            res.send(data);
        }
    });


});


router.post("/picWasScreenShotted/:objID/:byUser",function(req,res){

    var update = {$addToSet:{"metadata.screenShotted":req.params.byUser}};
    PictureBase.updatePictureInfo(req.params.objID,update,function(result){
        res.send(result);
    });
});
router.post("/picWasSeen/:objID/:byUser",function(req,res){

    var update = {$inc:{"metadata.numViews":1},$addToSet:{"metadata.seenBy":req.params.byUser}};
    PictureBase.updatePictureInfo(req.params.objID,update,function(result){
       res.send(result);
   });
});
router.post("/storySnap",upload.single("contentFile"), function (req, res) {
    //curl -F "contentFile=@./images/sky.jpg" -F "name=sky.jpg" -F "info={\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}" http://localhost:3000/storySnap
    var info = req.body.info;
    if(typeof(info) !== 'object'){
        info = JSON.parse(info);
    }
    var owner = info.owner;

    //var userList = req.body.userList;
    var path = req.file.path;

    //info = {\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}
    PictureBase.uploadPictureToStore(path,owner,info,function(data){
        if(data.Success){

            module.exports.updateUserSnapStory(owner,data.Success,data.date,function(toSend){
                res.send(toSend);
            });

        }else {
            res.send(data);
        }
    });


});
router.post("/register/:username/:password/:email/:firstname/:lastname", function (req, res) {

    var username = req.params.username;
    var password = req.params.password;
    var email = req.params.email;
    var firstname = req.params.firstname;
    var lastname = req.params.lastname;
    //var nameRegex = new RegExp("[a-zA-Z0-9]+");
    //var passwordRegex = new RegExp("[a-zA-Z0-9_!@#$%^&*]+");
    //var emailChecker = new RegExp("[a-zA-Z0-9_.]+@[a-zA-Z0-9_.]+\.[a-zA-Z]+(\.[a-zA-Z]+)?");

    var failure;
    if((failure= Validater.validateRegister(username,email,password)) != null){
        console.log("Invalid registration for user " + username + "with error" +failure);
        res.send(failure);
    }else {
        console.log("Registering " + username);
        var toRegister = Util.createUser();
        toRegister.username = username; toRegister.password = password;toRegister.email = email;
        toRegister.firstName = firstname; toRegister.lastName = lastname;
        Util.register(toRegister,function(val){
            res.send(val);
        });

    }
});

router.post("/addFriend/:username/:friendName/:type",function(req,res){
    var username = req.params.username;
    var friendName = req.params.friendName;
    var type = req.params.type;

    var friend = Util.createFriend(friendName,type);
    var meAsAFriend = Util.createFriend(username,type);

    Setter.updateOne({"username":username},{$addToSet:{"friendList":friend}},function(result){
        Util.helper(result,
            function(onErr){
                res.send(Util.createErrorMessage("Failed to add friend"));
            },
            function(onSucc){
                // add to other
                Setter.updateOne({"username":friendName},{$addToSet:{"friendList":meAsAFriend}},function(result){
                    Util.helper(result,function(onErr){
                        Setter.updateOne({"username":username},{pull:{"friendList":friend}},function(result){});
                        //failed DAMN
                        res.send(Util.createErrorMessage("Failed to add you to the friends list!"));
                        },function(onSucc){
                            var usernameAction = {"username":username};
                            var theAction= Util.createAction(Util.FRIEND_NOTIFICATION,usernameAction);
                            
                            Setter.updateOne({"username":friendName},{$addToSet:{"actionList":theAction}},function(res){

                            });
                            res.send(Util.SUCCESS_MESSAGE);

                    });

                });
            }
        );
    });


});
router.post("/helloPost",function(req,res){
    console.log("Req.body is  " + req.body);

    res.send({"I got your":"post!!"});
});
// END POST METHODS

module.exports = router;