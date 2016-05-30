/**
 * Created by neo on 5/27/16.
 */


var baseURL = "http://localhost:8080/";

var oReq = new XMLHttpRequest();

function reqListener () {
    console.log(oReq.responseText);
    // alert("YA HEARD\n");
}
oReq.onreadystatechange = function() {
/*    if (oReq.readyState == 4 && oReq.status == 200) {
        myFunction(myArr);
    }
  */

    var div = document.getElementById("insertHere");
    div.innerHTML = oReq.responseText;

    //var myArr = JSON.parse(oReq.responseText);

};

var mainGet = new XMLHttpRequest();


function setDiv(divName,toThis){
    var div = document.getElementById(divName);
    div.innerHTML = toThis.responseText;
}
mainGet.onreadystatechange = function(){

    var div = document.getElementById("mainGet");
    div.innerHTML = mainGet.responseText;


}
function getMain(){
    mainGet.open("GET", "http://localhost:8080/",true);
    mainGet.send();
}
/*
function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' +
            arr[i].display + '</a><br>';
    }
    document.getElementById("id01").innerHTML = out;
}
*/
oReq.open("GET", "http://localhost:8080/",true);
oReq.send();




function getFriend(){
    var text = document.getElementById("getFriendText").value;
    var friendURL = baseURL + "getFriendList/";
    friendURL+=text;
    var getFriendList = new XMLHttpRequest();
    getFriendList.onreadystatechange = function(){
            setDiv("getFriend",getFriendList);
    }

    getFriendList.open("GET", friendURL,true);
    getFriendList.send();

}
var globalUsername;

function login(){
    var username = document.getElementById("logUsername").value;
    globalUsername = username;
    var pass = document.getElementById("logPass").value;

    var regURL = baseURL + "login/";
    regURL += username + "/";
    regURL += pass + "/";
   
    var urlReq = new XMLHttpRequest();
    urlReq.onreadystatechange = function(){
        setDiv("loggin",urlReq);
    }

    urlReq.open("GET", regURL,true);
    urlReq.send();

}

function getGroupList(){
    var text = document.getElementById("getGroupList").value;
    var friendURL = baseURL + "getGroupMembers/";
    friendURL+=text;
    friendURL+=text;
    var getFriendList = new XMLHttpRequest();
    getFriendList.onreadystatechange = function(){
        setDiv("getFriend",getFriendList);
    }

    getFriendList.open("GET", friendURL,true);
    getFriendList.send();

}
function register(){
    var username = document.getElementById("username").value;
    globalUsername = username;
    var pass = document.getElementById("pass").value;
    var email= document.getElementById("email").value;
    var phone= document.getElementById("phone").value;

    var regURL = baseURL + "register/";
    regURL += username + "/";
    regURL += pass + "/";
    regURL += email + "/";
    regURL += phone + "/";

    var urlReq = new XMLHttpRequest();
    urlReq.onreadystatechange = function(){
        setDiv("reg",urlReq);
    }

    urlReq.open("GET", regURL,true);
    urlReq.send();

}

function updateList(){
    var group = document.getElementById("group").value;

    var regURL = baseURL + "getGroupItems/";
   regURL+=group + "/";
    regURL+=globalUsername;



    var urlReq = new XMLHttpRequest();
    urlReq.onreadystatechange = function(){
        setDiv("zeList",urlReq);

    }

    urlReq.open("GET", regURL,true);
    urlReq.send();

}
