/**
 * Created by neo on 7/18/16.
 */
var express = require('express');
var router = express.Router();
var Util = require("../Database/DBUtility");
var Getter = require("../Database/DBGetter");
var Setter = require("../Database/DBSetter");
var Remover = require("../Database/DBRemover");
var Validater = require("./Validater");
var ObjectId = require('mongodb').ObjectID;
var PictureBase = require('../Database/PictureBase');
var Async = require('async');

/*
 I could just have the app send commands to the server

 */
//curl -X DELETE http://localhost:3000/helloDelete
router.delete("/helloDelete", function (req, res) {
    res.send({"I got your": "Delete!!"});
});


router.delete("/findOneAndDelete/:username/:password/", function (req, res) {
    var username = req.params.username;
    var password = req.params.password;

    Validater.validateAndCheckAuth(username, password, function (result) {
        if (!result.Success) {
            res.send(result);
        } else {
            Remover.findOneAndDelete({"username": username}, function (val) {
                res.send(val);
            });

        }
        // make the request

    });

});

router.removeUserSnapStory = function (owner, snapID, callback) {
    var filter = {"username": owner};
    var snap = Util.createSnap(snapID);
    var update = {
        $pull: {"story": snap},
    };
    Setter.updateOne(filter, update, function (result) {


        Util.helper(result, 1,
            function (errRes) {
                var builder = Util.ERROR_MESSAGE;
                builder.Error = {"Message": "Failed to update the story :(   " + errRes.message};
                callback(builder);
            },
            function (successRes) {
                var builder = {"Success": snapID};
                callback(builder);
            });

    });
};
//END HELPER FUNCTIONS

// BEGIN DELETE METHODS

// make sure its astring...
// /deleteSnapFromStory/blahlblah/blah/"578ec56ce09f0c7e2f2447a9"
router.delete("/deleteSnapFromStory/:username/:password/:snapID", function (req, res) {


    var username = req.params.username;
    var password = req.params.password;
    var snapID = req.params.snapID;


    Validater.validateAndCheckAuth(username, password, function (result) {
        if (!result.Success) {
            res.send(result);
        } else {


            PictureBase.removePicture(snapID, function (data) {
                if (data.Success) {
                    // I should probably push a command onto everyone elses story who has seen it
                    console.log("Successfully deleted the file with data " + data);
                    res.send(data);
                    var user = data.Success.metadata.uploadedBy;
                    var id = data.Success._id
                    router.removeUserSnapStory(user, id, function (res) {
                        console.log("\nOn removing snap story" + res);
                        return;
                    });
                    var userArray = data.Success.metadata.sentTo;
                    if (userArray) {
                        for (var i = 0; i < userArray.length; i++) {
                            var username = userArray[i];
                            // if it fails oh well, you will be able to see content that should have been deleted
                            //
                            Setter.updateOne({"username": username}, {$addToSet: {"actionList": action}});
                        }
                    }
                } else {
                    res.send(data);
                    console.log("Un-successfully deleted the file with data " + data);
                }
            });


        }

    });


});

router.delete("/removeFriend/:username/:password/:friendUserName/:friendType", function (req, res) {
    var username = req.params.username;

    var password = req.params.password;
    var friendName = req.params.friendUserName;
    var friendType = req.params.friendType;

    router.deleteFriendWithWaterfall(username,password,friendName,friendType,res);

});

router.deleteFriendWithWaterfall = function(username,password,friendName,friendType,res){
    // if you want to return immediatelely on error just do callback(errorMessageHere);


    Async.waterfall([
       function(callback){
           Getter.findOne({"username": friendName}, function (theQueryRes) {
                if(theQueryRes.Error){
                    //failure
                    callback(theQueryRes);
                }else{
                    callback(null,theQueryRes);
                }
           });
       },
        function(query,callback){
            Validater.validateAndCheckAuth(username, password, function (result) {
                if(!result.Success){
                    //failure
                    callback(result);

                }else{
                    callback(null);
                }
            });

        },
        function(callback){
            var query = {"username": username};
            var pull = {$pull: {"friendList":Util.createFriend(friendName,friendType)}};
            Setter.updateOne(query, pull, function (result) {
               Util.helper(result,1,function(onErr){callback(onErr)},function(onSucc){callback(null)});
            });
        },
        function(callback){
            // deleted friend from users list now delete from my list
            var query = {"username": friendName};
            var pull = {$pull: {"friendList":Util.createFriend(username,friendType)}};
            Setter.updateOne(query, pull, function (result) {
                Util.helper(result,1,function(errRes){
                    // undo on failure
                    var query = {"username": username};
                    var push = {$addToSet: {"friendList":Util.createFriend(friendName,friendType)}};
                    Setter.updateOne(query,push,function(x){});
                    callback(errRes);
                },function(onSucc){callback(null,onSucc)});
            });
        }
    ],function(err,result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    });

}
// END DELETE METHODS

module.exports = router;