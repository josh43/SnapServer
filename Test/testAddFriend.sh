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



createUser Joshua
createUser Mark


curl -X POST http://localhost:3000/addFriend/Joshua/Mark/2
curl -X POST http://localhost:3000/addFriend/Mark/Joshua/3


echo "Getting Josh info"
curl -X GET http://localhost:3000/query/Joshua/%7B%22username%22:%22Joshua%22%7D

echo "\n"

echo "getting Mark info"
curl -X GET http://localhost:3000/query/Joshua/password/"{\"username\":\"Mark\"}"




removeAllUsers
