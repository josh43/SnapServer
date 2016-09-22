/**
 * Created by josh on 9/21/16.
 */
var db = null;
var getter ={};
var Util = require("./DBUtility");

/*

 */
setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);
