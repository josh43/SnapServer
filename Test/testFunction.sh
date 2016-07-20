#!/bin/bash

#p=30;
#for (( i=1; i<p; i++ )); do

#done

# $1 ... $n

# to delete use  curl -X DELETE localhost:3000/deleteSnapFromStory/:username/:password/:OBJECTID
createUser(){
    curl -X POST localhost:3000/register/$1/password/a@email.com/aPerson/last
    echo "\n"

}
removeUser(){
    curl -X DELETE localhost:3000/findOneAndDelete/$1/password
    echo "\n"

}
names='a b c d e f g h i j k l m n o p q r s t u v w x y z'

createAllUsers(){
    for name in $names
    do
        echo "creating" $name
        createUser $name
    done

}

removeAllUsers(){
  for name in $names
    do
        echo "removing" $name
        removeUser $name
    done

}
sendSnapToPeople(){

#b should have a ton of snaps
    for name in $names
    do
        echo "sending snap to" $name
        curl -F "contentFile=@../images/sky.jpg" -F "name=sky.jpg" -F "userList={\"users\":[\"b\",\"$name\"]}" -F "info={\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"a\"}" http://localhost:3000/sendSnap
    done
}


createAllUsers

sendSnapToPeople

curl -X GET http://localhost:3000/login/a/password
echo "\n"

curl -X POST http://localhost:3000/addFriend/a/b/1
curl -X POST http://localhost:3000/addFriend/a/c/2

curl -X POST http://localhost:3000/addFriend/a/d/1
curl -X POST http://localhost:3000/addFriend/b/b/3


curl -X DELETE http://localhost:3000/removeFriend/a/password/b/1
curl -X DELETE http://localhost:3000/removeFriend/b/password/a/1

curl -X DELETE http://localhost:3000/removeFriend/a/password/d/1
curl -X DELETE http://localhost:3000/removeFriend/a/password/c/2


curl -F "contentFile=@../images/sky.jpg" -F "name=sky.jpg" -F "info={\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}" http://localhost:3000/storySnap
echo "\n"

curl -F "contentFile=@../images/sky.jpg" -F "name=sky.jpg" -F "userList={\"users\":[\"stefan\",\"miguel\",\"berneaseMountainDog\"]}" -F "info={\"snapLength\":5,\"snapType\":1,\"contentType\":0,\"owner\":\"Blade\"}" http://localhost:3000/sendSnap
echo "\n"




removeAllUsers
