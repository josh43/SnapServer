/**
 * Created by neo on 7/18/16.
 */
var express = require('express');
var router = express.Router();
var util = require("../Database/DBUtility");
var getter = require("../Database/DBGetter");
var setter = require("../Database/DBSetter");
var ObjectId = require('mongodb').ObjectID;

// @ wiki
// The PUT method requests that the enclosed entity be stored
// under the supplied URI. If the URI refers to an already existing
// resource, it is modified; if the URI does not point to an
// existing resource, then the server can create the resource with that URI.[15]

//curl -X PUT http://localhost:3000/helloPut
router.put("/helloPut",function(req,res){

    res.send({"I got your":"Put!!"});
});




// END PUT METHODS


module.exports = router;