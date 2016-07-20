/**
 * Created by neo on 7/18/16.
 */


var toExport;

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

var badEmail = {"Error":{"Message":"Bad-Email"}};
var badUsername = {"Error":{"Message":"Bad-Username"}};
var badPhone = {"Error":{"Message":"Bad-phone"}};
var badPassword = {"Error":{"Message":"Bad-password"}};

toExport.validateRegister = function( email, pass,  user,  phone){
    if(!validateEmail(email)){
        return badEmail;
    }else if(!validatePassword(pass)){
        return badPassword;
    }else if(!validatePhoneNumber(phone)){
        return badPhone;
    }else if(!validateUserName(user)){
        return badUsername;
    }else{
        return NULL;
    }
}


module.exports = toExport;