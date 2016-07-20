/**
 * Created by neo on 7/18/16.
 */
// used to remove files not databases :D
var db = null;
var Util = require('./DBUtility');

var remover = module.exports = {};

/*

 */
setTimeout(function () {
    db = require("./DBConnection").getDB();
}, 4000);



remover.findOneAndDelete = function(payload,callback){
    db.collection(Util.USER_COLLECTION).findOneAndDelete(payload,function(err,res){
        var toReturn;
        if(err){
            toReturn = ERROR_MESSAGE;
            toReturn.Error = {"ErrorMessage":err,"Message":"unable to delete :("};
        }else if( res == null){
            toReturn = ERROR_MESSAGE;
            toReturn.Error = {"Message":"unable to delete :("};
        }else{
            toReturn = res;
        }
        callback(toReturn);
    });

}


