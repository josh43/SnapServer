/**
 * Created by root on 6/27/16.
 */
var mongo = require('mongodb');

var Grid = require('gridfs-stream');
var fs = require('fs');
var MongoID = require('mongodb').ObjectID;
var gfs;

var db;


setTimeout(function () {
    db = require("./DBConnection").getDB();
    db.open(function (err) {
        if (err){
            console.log("Failed to open grid-fs stream!!!");
            return;
        }
        gfs = Grid(db, mongo);
        // all set!
    });
},4000);
// create or use an existing mongodb-native db instance.
// for this example we'll just create one:
var BASIC_ERROR = {"Error":"Something went wrong"};
// make sure the db instance is open before passing into `Grid`
module.exports.getGridFS = function(){
    return gfs;
};
module.exports.getFileOptions = function(fileName){
    return {
        "filename":fileName
    }
};


var createNewOptions = function(fileName){
    return {
        "_id":new MongoID(),
        "filename":fileName,
        "mode":"w",
        chunkSize:1024,

        metadata: {
            uploadedBy: "",
            contentType:-1,
            dataFormat:-1,
            seenBy: [],
            sentTo: [],
            numViews:0,
            lastSeen:"",
            lastSeenBy:"",
            screenShotted:"",
            date:{},
	    length:-1.0
        }

    }
}


module.exports.getContent= function(objectID,res){
    gfs.exist({"_id": objectID}, function (err, found) {
        if (err) {
            res.send({"Error": " Couldnt find snap!"});
        }else if(found){

            var readStream = gfs.createReadStream({"_id":objectID});
            if (readStream) {
                readStream.pipe(res);
            } else {
                res.send({"Error": " Couldnt find snap!"});
            }
        }else{
            res.send({"Error": " Couldnt find snap!"});

        }
    });
};

module.exports.getContentInfo = function(snapID,callback){
    db.collection("fs.files").find({"_id":snapID}).limit(1).toArray(
        function(err,res){
            if(err){
                callback(BASIC_ERROR);
            }else if(!res){
                callback(BASIC_ERROR);
            }else{

                    callback({"Success":res});

            }
        });


};
//{$addToSet: {"members": {$each: [newFriend]}}}
module.exports.snapWasSentTo = function(id,toUser,callback){
    db.collection("fs.files").updateOne({"_id":id},
        {$addToSet:{"metadata.sentTo":toUser}},
        function(err,res){
            if(err){
                callback(BASIC_ERROR);
            }else if(!res){
                callback(BASIC_ERROR);
            }else{
                if(res.matchedCount != 1){
                    console.log("Error didnt upsert correctly match count was" + res.matchedCount);
                    callback({"Error":res});

                }else{
                    console.log("The number of feilds updates is" + res.matchedCount);
                    callback({"Success":res});

                }
            }
        });
};


 // Screen Shotted == update -> {$addToSet:{"metadata.screenShotted":"MEEE_I_DID_IT!!!"}}
 // SeenPicture == update -> {$addToSet:{"metadata.seenBy":"MEEE_I_SAW!!"}}
 // SentTo       {$addToSet:{"metadata.sentTo":toUser}},
 // picWasSeen    {$inc:{"metadata.numViews":1},$addToSet:{"metadata.seenBy":byUser}}



module.exports.updatePictureInfo = function(id,update,callback){
    db.collection("fs.files").updateOne(
        {"_id":id}, // UPDATE CRITERIA
        update,
        {upsert:false},
        function(err,res){
            if(err){
                callback(BASIC_ERROR);
            }else if(!res){
                callback(BASIC_ERROR);
            }else{
                if(res.matchedCount != 1){
                    console.log("Error didnt upsert correctly match count was" + res.matchedCount);
                }else{
                    console.log("The number of feilds updates is" + res.matchedCount);
                }
                callback({"Success":res});
            }
        });
};




// info = {\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}
module.exports.uploadPictureToStore = function(fileLoc,fileName,info,callback) {
// commented out recently
//    gfs = Grid(db, mongo);

    var optionOne = createNewOptions(fileName); optionOne.metadata.uploadedBy = info.owner;
    optionOne.metadata.dataFormat = info.snapType; optionOne.metadata.contentType = info.contentType;
    optionOne.metadata.length = info.snapLength; optionOne.metadata.date = new Date();
    console.log("Logging first" + optionOne);

    var writeStream = gfs.createWriteStream(optionOne);
    writeStream.on("error",function(err){
        console.log("Error writing to grid-fs stream \n");
        callback({"Failure":"On writing to disk"});
        fs.unlink(fileLoc);

    });
    writeStream.on("close",function(file){
        console.log("Success writing to mongo \n");
        // now actually find it
        callback({"Success":optionOne._id,"date":optionOne.metadata.date});
        fs.unlink(fileLoc);
    });
    if(writeStream) {

        fs.createReadStream(fileLoc).pipe(writeStream);
    }else{
        callback({"Error":"Couldnt open gfs stream :| "});
        fs.unlink(fileLoc);

    }



    // all set!
};

module.exports.removePicture = function(id,callback) {

    gfs.findOne({"_id":id}, function (err, found) {
        if (err) {
            callback({"Error": "Couldnt delete file"});
        }else if(!found){
            callback({"Error": "Couldnt find file"});
        }else{

            gfs.remove({"_id":id}, function (err) {
                if (err) {
                    callback({"Error": "Couldnt remove file"});
                }else if(!found){
                    callback({"Error": "Couldnt remove the file"});
                }else {
                    callback({"Success": found});

                }

            });
        }
    });


    // all set!
};

