var express = require('express');
var router = express.Router();
var util = require("../Database/DBUtility");
var getter = require("../Database/DBGetter");
var setter = require("../Database/DBSetter");
var ObjectId = require('mongodb').ObjectID;


var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var nameRegex = new RegExp("[a-zA-Z0-9]+");
var passwordRegex = new RegExp("[a-zA-Z0-9_!@#$%^&*]+");
var phoneNumber = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{9}");
function validateEmail(email) {
    return re.test(email);
}
function validatePassword(pw) {
    return passwordRegex.test(pw);
}
function validateUserName(userN) {
    return nameRegex.test(userN);
}
function validatePhoneNumber(phone) {
    return phoneNumber.test(phone);
}
// BEGIN UTIL FUNCTIONS

//router.get("/login/:loginID/:password", function (req, res) {





router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
