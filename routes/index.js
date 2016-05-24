var express = require('express');
var router = express.Router();
var util = require("../Utility");
/*
 var db;
 // great code right!!!
 */
// great code right!!!
/* GET home page. */



router.get("/register/:loginID/:password/:email/:phone",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  var email = req.params.email;
  var phone = req.params.phone;
  if(isNaN(phone)){
    res.send({"Error":"Bad phone"});

  } else {

    console.log("Registering "+  username);

    util.register(username, password,email,phone, function (result) {
      res.send(result);
    });
  }
});
router.get("/changePass/:loginID/:password/:newPass",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  var newPass = req.params.newPass;
  console.log(username + "Changing password\n");

  util.changePassword(username,password,newPass,function(result){
    res.send(result);
  });

});
router.get("/addFriend/:me/:friend/",function(req,res){

  var me = req.params.me;
  var friend = req.params.friend;
  console.log(me + "Is adding friend " + friend);

  util.addFriend(me,friend,function(result){
    res.send(result);
  });

});

router.get("/createGroup/:me/:group/",function(req,res){

  var me = req.params.me;
  var group = req.params.group;
  console.log(me + "Is creating a group " + group);

  util.createGroup(me,group,function(result){
    res.send(result);
  });

});

router.get("/addItemToGroup/:me/:group/:item",function(req,res){

  var me = req.params.me;
  var group = req.params.group;
  var item = req.params.item;
  console.log(me + "Is adding the item" + item + " to the group " + group);

  util.addItemToGroup(me,group,item,function(result){
    res.send(result);
  });


});
router.get("/confirmFriend/:me/:friend/",function(req,res){

  var me = req.params.me;
  var friend = req.params.friend;
  console.log(me + "Is confirming friend " + friend);

  util.acceptFriend(me,friend,function(result){
    res.send(result);
  });

});
router.get("/getFriendList/:me/",function(req,res){

  var me = req.params.me;
  console.log(me + "Is getting friend list\n");

  util.getFriendList(me,function(result){
    res.send(result);
  });

});
router.get("/getPendingFriends/:me/",function(req,res){

  var me = req.params.me;
  console.log(me + "Is getting pending friend list\n");

  util.getPendingFriends(me,function(result){
    res.send(result);
  });

});
router.get("/deleteAccount/:loginID/:password/",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  console.log(username + "Is deleting account\n");

  util.deleteAccount(username,password,function(result){
    res.send(result);
  });

});

router.get("/login/:loginID/:password",function(req,res){

  var username = req.params.loginID;
  var password = req.params.password;
  console.log(username + "Logging in\n");

  util.login(username,password,function(result){
        res.send(result);
  });

});
router.get("/addFriend/:userOne/:userTwo",function(req,res){
  var userOne = req.params.userOne;
  var userTwo = req.params.userTwo;
  console.log(userOne + "Adding " +userTwo + " to friend list");


});

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

module.exports = router;
