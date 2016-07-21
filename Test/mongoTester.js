var connection = new Mongo();
var db = connection.getDB("test");

// load("mongoTester.js")
// see whaaat happens
db.fs.files.findOne();
var me={"username":"Falcon"};

var createUser = function(name){
		db.USERS.update({
			"username":name
		},
		{
		 'username':name,
	        'firstName':"Joshua",
	        'lastName':"yeee",
	        'password':"password",
	        'email':"josh@email.com",
	        'snapchats':[],
	        'story':[],
	        'lastStoryUpdate':new Date(),
	        'friendList':[],
	        'actionList':[]
		},{upsert:true});	
}

db.USERS.update({"username":"Falcon"},
{
	 'username':"Falcon",
        'firstName':"Joshua",
        'lastName':"yeee",
        'password':"password",
        'email':"josh@email.com",
        'snapchats':[],
        'story':[],
        'lastStoryUpdate':new Date(),
        'friendList':[],
        'actionList':[]
},{upsert:true});


createUser("Mark");
createUser("Auto");

db.USERS.update(me,{$addToSet:{"friendList":["Mark","Auto"]}});
// dont try and update by _id it just doesn't work with the shell
// or it was because of date:{1}
//"yyyy-MM-dd'T'HH:mm:ss'.'ZZZZ"
db.fs.files.update(
	{"filename" : "trailerParkClip.mov"},
	{$set:
		{"metadata":
    	   {
    	   "uploadedBy":"Falcon",
    	   "contentType":1,
    	   "seenBy":["BillyBob"],
    	   "sentTo":["airbody","billybob"],
    	   "numViews":2,"lastSeen":"",
    	   "screenShotted":"",
    	   "date":new Date(),
    	   "length":1.8
    	   }
		}
    }
);
