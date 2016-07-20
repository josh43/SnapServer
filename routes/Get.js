/**
 * Created by neo on 7/18/16.
 */
var express = require('express');
var router = express.Router();
var Util = require("../Database/DBUtility");
var Getter = require("../Database/DBGetter");
var Setter = require("../Database/DBSetter");
var ObjectId = require('mongodb').ObjectID;
var Grid = require('gridfs-stream');
var Validator = require('./Validater');
var Getter = require("../Database/DBGetter");
var Async = require("async");
var PictureBase = require("../Database/PictureBase");
router.get("/helloGet",function(req,res){

    res.send({"I got your":"Get!!"});
});

/*
 //  http://localhost:3000/queryWithProjection/Blade/awesome/%7B%22username%22:%22Blade%22%7D/{"snapchats":1}
Date myLastCheck = someDateInPast();
iOS.checkMyFriendsStories(queryWithProjection/:username,:password/:{"username":username}/:{"friendList":1}).onFinish(friendList){

}



 */
// it does also remove content from you inbox ::::|||||


router.get("/login/:username/:password",function(req,res){
   Validator.validateAndCheckAuth(req.params.username,req.params.password,function(result){
       res.send(result);
   });
});
router.get("/getPictureInfo/:snapID",function(req,res){
    var snapID = req.params.snapID;
    PictureBase.getContentInfo(new ObjectId(snapID),function(result){
        res.send(result);
    });
});

// will return an array of content that you should check out BRAH!!!
router.get("/getLastTimeFriendsUpdatedStory/:username/:password/:lastTimeChecked",function(req,res){
    var username = req.params.username;
    var password = req.params.password;
    var lastChecked = req.params.lastTimeChecked;
    Getter.findOne({"username":username},function(results){
        if(results.Error){
            //failureres.
            res.send(Util.createErrorMessage("Failed to get your friend list :("));
        }else{
            var friendList = results.friendList;
            var onFinish = friendList.length;
            var toReturn = [];


            friendList.forEach(function(friend,index,array){
                Getter.findOneWithProjection({"username": friend.username}, {"lastStoryUpdate": 1}, function (result) {
                    if (!result.Error) {
                        if (friend.friendType == Util.MUTUAL_FRIENDS) {
                            toReturn.push({"username": friend.username, "lastStoryUpdate": result.lastStoryUpdate});

                        }
                    }
                    onFinish--;
                    if (onFinish == 0) {
                        // send it
                        res.send(toReturn);
                    }

                });


            });

        }


    });
});

/*
 iOS.checkMySnapInbox(queryWtihProjection/:username,:password/:queryPayload/:projection){
    queryPayload ->{"username":username}
    projection   ->{"snapchats":1}
    }().onFinish(function(resultArray){
    for(string snapID in snapchats){
    iOS.getContent(snapID).download().andDoSomethingFUN!!!!!();
 }

 }

 */
// http://localhost:3000/getContentFromInbox/b/password/2578f19181c91e2a14c801bb6
router.get("/getContent/:username/:password/:snapID",function(req,res){
    var username = req.params.username;
    var password = req.params.password;
    var snapID = req.params.snapID;
    // snapID is an object id
    // you probably should validate

    Setter.updateOne({"username":username},{$pull:{"snapchats":{"snapID":new ObjectId(snapID)}}},function(result) {
       Util.helper(result,1,
       function(onErr){
           res.send(Util.createErrorMessage("unable to get the content"));

       },
       function(onSuccess){
           PictureBase.getContent(snapID, res);

       });

    });

});
router.get("/queryWithProjection/:username/:password/:queryPayload/:projection",function(req,res) {
    var username = req.params.username;
    var password = req.params.password;
    var projection = req.params.projection;
    var query =    req.params.queryPayload;
    if(typeof(query) !== 'object'){
        query = Validator.tryAndMakeObject(query);
        if(query == null){
            res.send({"Error":{"Message":"Bad query object"}});
            return;

        }
    }
    if(typeof(projection) !== 'object'){
        projection = Validator.tryAndMakeObject(projection);
        if(projection == null){
            res.send({"Error":{"Message":"Bad query object"}});
            return;

        }
    }
    console.log("user" + username + "is making the query" + query);
    Validator.validateAndCheckAuth(username,password,function(result){
        if(!result.Success){
            res.send(result);
        }else{
            // make the request
            Getter.findWithProjection(query,projection,function(val){
                res.send(val);
            });
        }
    });

});

//  http://localhost:3000/query/Blade/awesome/%7B%22username%22:%22Blade%22%7D
router.get("/query/:username/:password/:queryPayload",function(req,res){
    var username = req.params.username;
    var password = req.params.password;
    var query =    req.params.queryPayload;
    if(typeof(query) !== 'object'){
        query = Validator.tryAndMakeObject(query);
        if(query == null){
            res.send({"Error":{"Message":"Bad query object"}});
            return;
        }
    }
    console.log("user" + username + "is making the query" + query);
    Validator.validateAndCheckAuth(username,password,function(result){
        if(!result.Success){
            res.send(result);
        }else{
            // make the request
            Getter.find(query,function(val){
                res.send(val);
            });
        }
    });



});
module.exports = router;