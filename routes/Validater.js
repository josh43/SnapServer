/**
 * Created by neo on 7/18/16.
 */
var Getter = require("../Database/DBGetter");


var toExport = {};

var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var usernameRegex = new RegExp("[a-zA-Z0-9]+");
var nameRegex = new RegExp("[a-zA-Z]+");
var passwordRegex = new RegExp("[a-zA-Z0-9_!@#$%^&*]+");
var phoneNumber = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{9}");
function validateEmail(email) {
    return re.test(email);
}
function validatePassword(pw) {
    return passwordRegex.test(pw);
}
function validateUserName(userN) {
    return usernameRegex.test(userN);
}
function validatePhoneNumber(phone) {
    return phoneNumber.test(phone);
}
function validateName(name){
    return nameRegex.test(name);
}


var badEmail = {"Error":{"Message":"Bad-Email"}};
var badUsername = {"Error":{"Message":"Bad-Username"}};
var badPhone = {"Error":{"Message":"Bad-phone"}};
var badPassword = {"Error":{"Message":"Bad-password"}};
var badName = {"Error":{"Message":"Bad-name"}};

toExport.validateRegister = function (user,  email,pass,firstname,lastname){
    if(!validateEmail(email)){
        return badEmail;
    }else if(!validatePassword(pass)){
        return badPassword;
    }else if(!validateUserName(user)){
        return badUsername;
    }else if(!validateName(firstname)){
        return badName;
    }else if(!validateName(lastname)){
        return badName;
    }else{
        return null;
    }
}

toExport.validateAndCheckAuth = function(username, password,callback){
    if(!validateName(username)){
        callback(badEmail);
    }else if(!validatePassword(password)){
        callback(badPassword);
    }else{
        Getter.login(username,password,function(data){
           callback(data);
        });
    }
}

toExport.tryAndMakeObject = function(toMake){
    var toReturn = JSON.parse(toMake);
     return toReturn;
}
module.exports = toExport;