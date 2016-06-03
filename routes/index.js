var express = require('express');
var router = express.Router();
var util = require("../Database/DBUtility");
var getter = require("../Database/DBGetter");
var setter = require("../Database/DBSetter");
/*
 var db;
 // great code right!!!
 */
// great code right!!!
/* GET home page. */
// got it from the web
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
function validatePhoneNumber(phone){
  return phoneNumber.test(phone);
}
// BEGIN UTIL FUNCTIONS
router.get("/register/:loginID/:password/:email/:phone",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  var email = req.params.email;
  var phone = req.params.phone;

  //var nameRegex = new RegExp("[a-zA-Z0-9]+");
  //var passwordRegex = new RegExp("[a-zA-Z0-9_!@#$%^&*]+");
  //var emailChecker = new RegExp("[a-zA-Z0-9_.]+@[a-zA-Z0-9_.]+\.[a-zA-Z]+(\.[a-zA-Z]+)?");
  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validatePassword(password))){
    res.send({"Error":"Please enter valid password"});

  }else if(!(validateEmail(email))){
    res.send({"Error":"Please enter valid e-mail"});
  }
  else if(!validatePhoneNumber(phone)){
    res.send({"Error":"Bad phone"});

  } else {

    console.log("Registering "+  username);

    util.register(username, password,email,phone, function (result) {
      res.send(result);
    });
  }
});
router.get("/getGroups/:loginID",function(req,res){
  var username = req.params.loginID;
  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else{

    console.log(username + "getting groups \n");

    getter.getGroupNames(username, function (result) {
      res.send(result);
    });
  }
});
router.get("/login/:loginID/:password",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validatePassword(password))){
    res.send({"Error":"Please enter valid password"});
  }else {

    console.log(username + "Logging in\n");

    util.login(username, password, function (result) {
      res.send(result);
    });
  }
});
router.get("/changePass/:loginID/:password/:newPass",function(req,res){
  var username = req.params.loginID;
  var password = req.params.password;
  var newPass = req.params.newPass;

  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validatePassword(password))){
    res.send({"Error":"Please enter valid password"});

  }else if(!(validatePassword(newPass))) {
    res.send({"Error": "Please enter valid new password"});
  }else {

    console.log(username + "Changing password\n");

    util.changePassword(username, password, newPass, function (result) {
      res.send(result);
    });
  }
});
router.get("/deleteAccount/:loginID/:password/",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  console.log(username + "Is deleting account\n");

  util.deleteAccount(username,password,function(result){
    res.send(result);
  });

});
// END UTIL FUNCTIONS

//BEGIN SETTER FUNCTIONS
router.get("/createGroup/:me/:group/",function(req,res){

  var me = req.params.me;
  var group = req.params.group;
  console.log(me + "Is creating a group " + group);

  setter.createGroup(me,group,function(result){
    res.send(result);
  });

});
router.get("/addItemToGroup/:me/:group/:item",function(req,res){

  var me = req.params.me;
  var group = req.params.group;
  var item = req.params.item;
  console.log(me + "Is adding the item" + item + " to the group " + group);

  setter.addItemToGroup(me,group,item,function(result){
    res.send(result);
  });


});
router.get("/confirmFriend/:me/:friend/",function(req,res){

  var me = req.params.me;
  var friend = req.params.friend;
  console.log(me + "Is confirming friend " + friend);

  setter.acceptFriend(me,friend,function(result){
    res.send(result);
  });

});
router.get("/addFriend/:me/:friend/",function(req,res){

  var me = req.params.me;
  var friend = req.params.friend;

  if(!(validateUserName(me))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validateUserName(friend))){
    res.send({"Error":"Please enter valid friend name"});
  }else {
    console.log(me + "Is adding friend " + friend);

    setter.addFriend(me, friend, function (result) {
      res.send(result);
    });
  }




});
router.get("/addMemberToGroup/:loginID/:groupID/:newMember",function(req,res){
  var username = req.params.loginID;
  var groupID= req.params.groupID;
  var newMember= req.params.newMember;

  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validateUserName(newMember))){
    res.send({"Error":"Please enter valid user name"});

  }else {

    setter.addFriendToGroup(username, groupID, newMember, function (result) {
      res.send(result);
    });
  }
});
router.get("/removeMemberFromGroup/:loginID/:groupID/:toRemove",function(req,res){
  var username = req.params.loginID;
  var groupID= req.params.groupID;
  var newMember= req.params.toRemove;

  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validateUserName(newMember))){
    res.send({"Error":"Please enter valid user name"});

  }else {

    setter.removeFriendFromGroup(username, groupID, newMember, function (result) {
      res.send(result);
    });
  }
});
router.get("/removeItemFromGroup/:loginID/:groupID/:item",function(req,res){
  var username = req.params.loginID;
  var groupID= req.params.groupID;
  var theItem= req.params.item;

  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else if(!(validateUserName(theItem))){
    res.send({"Error":"Please enter valid user name"});

  }else {
    setter.removeItemFromGroup(username, groupID, theItem, function (result) {
      res.send(result);
    });
  }
});
//END   SETTER FUNCTIONS

//BEGIN GETTER FUNCTIONS
router.get("/getGroupMembers/:loginID/:groupID",function(req,res){
  var username = req.params.loginID;
  var groupID= req.params.groupID;


  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else {

    getter.getGroupMembers(username, groupID, function (result) {
      res.send(result);
    });
  }
});
router.get("/getGroupItems/:loginID/:groupID",function(req,res){
  var username = req.params.loginID;
  var groupID= req.params.groupID;


  if(!(validateUserName(username))){
    res.send({"Error":"Please enter valid user name"});

  }else {

    getter.getGroupItems(username, groupID, function (result) {
      res.send(result);
    });
  }
});
router.get("/findFriends/:regex",function(req,res){

  var reg =  "^" + req.params.regex + ".*";
  console.log("Searching for " + reg);

  getter.findFriends(reg,function(result){
    res.send(result);
  });

});
router.get("/getFriendList/:me/",function(req,res){

  var me = req.params.me;
  console.log(me + "Is getting friend list\n");

  getter.getFriendList(me,function(result){
    res.send(result);
  });

});
router.get("/getPendingFriends/:me/",function(req,res){

  var me = req.params.me;
  console.log(me + "Is getting pending friend list\n");
  getter.getPendingFriends(me,function(result){
    res.send(result);
  });

});

//END   GETTER FUNCTIONS






router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

module.exports = router;
