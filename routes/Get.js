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
/* You can query on multiple fields!!!!
 db.USERS.find({
 "username":"Ronna", \\ query field 1
 "story.date":{$gte : ISODate("2016-07-26T01:13:21.111Z")} \\ query 2
 }).pretty()


 db.USERS.aggregate([
    {$project:{"_id":0,"story":1,"username":1}},
    {$match:{"username":"Ronna","story.date":{$gte:ISODate("2016-07-26T01:13:21.111Z")}}}
 ])
 */

router.get("/testAgg",function(req,res){
   Getter.aggregate([
       {$project:{"_id":0,"story":1,"username":1}},
       {$match:{"username":"Ronna","story.date":{$gte:new Date("2016-07-26T01:13:21.111Z")}}}
   ],function(data){
       res.send(data);
   })
});
// WILL RETURN THIS
// "story" : [ { "snapID" : ObjectId("5796b931ef8de5562342f347"), "date" : ISODate("2016-07-26T01:13:21.111Z") },
//              { "snapID" : ObjectId("5796c13023c5368b31996e79"), "date" : ISODate("2016-07-26T01:47:28.388Z") }
//           ]


function isLessThanTwentyFour( d){
    var ltwentyFour = new Date();
    //ltwentyFour.setMilliseconds(ltwentyFour.getMilliseconds() - (24 * 1000 * 60 * 60));
    ltwentyFour.setMilliseconds(ltwentyFour.getMilliseconds() - 86400000);
    return d > ltwentyFour;
};

router.get("/getLastTimeFriendsUpdatedStory/:username/:password/:lastTimeChecked",function(req,res){
    var username = req.params.username;
    var password = req.params.password;
    var lastChecked = req.params.lastTimeChecked;
    var theDate = new Date(lastChecked);

   // var twentyFourAgo =  Date.now();
   // twentyFourAgo.setTime(twentyFourAgo.getMilliseconds() - (24 * 1000 * 60));
//
    // None of the easy time functions are implemented soo this will be a TODO://


   // if(theDate < twentyFourAgo){
   //     console.log("Error trying to make query past 24 hours ago :(");
   //     res.send({"Error": "trying to make query past 24 hours ago :("});
   //     return;
   // }



    Getter.findOne({"username":username},function(results){
        if(results.Error){

            res.send(Util.createErrorMessage("Failed to get your friend list :("));
        }else{
            var friendList = results.friendList;
            var onFinish = friendList.length;
            var toReturn = [];


            friendList.forEach(function(friend,index,array){

                var agg = [
                    {$project:{"_id":0,"story":1,"username":1}},
                    {$match:{"username":friend.username,"story.date":{$gte:theDate}}}
                    ];
                Getter.aggregate(agg,function(result){
                    if(!result.Error) {
                        if (result.length > 0) {
                            console.log("Result of aggregation" + result);
                            var twentyFourAgo = new Date(-24 * 60 * 60 * 60);
                            if (friend.friendType == Util.MUTUAL_FRIENDS) {
                                for (var i = 0; i < result[0]["story"].length; i++) {
                                    if(isLessThanTwentyFour(result[0]["story"][i].date )) {
                                        toReturn.push({"snapID": result[0]["story"][i].snapID});
                                    }
                                }
                            }
                        }
                    }

                    onFinish--;
                    if (onFinish == 0) {
                        // send it
                        console.log("Sending stories that the user should checkout" + toReturn);
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
router.get("/getSnapFromInbox/:username/:password/:snapID",function(req,res){
    var username = req.params.username;
    var password = req.params.password;
    var snapID = req.params.snapID;
    // snapID is an object id
    // you probably should validate

    Setter.updateOne({"username":username},{$pull:{"snapchats":{"snapID":new ObjectId(snapID)}}},function(result) {
       Util.helper(result,1,
       function(onErr){
           res.send(Util.createErrorMessage("unable to get the content this is likely because this snap hasn't been placed in your inbox"));

       },
       function(onSuccess){
           PictureBase.getContent(snapID, res);

       });

    });

});

router.get("/getStoryContent/:snapID",function(req,res){
    PictureBase.getContent(req.params.snapID, res);
});

router.get("/findUsers/:withUsername",function(req,res){
    var username = req.params.withUsername;
    console.log("Finding users via regex with name  " + username);
    var reg = username + ".*";
    Getter.findFriends(reg,function(friends){

        res.send(friends);
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