#!/bin/bash
echo basic get
curl \
--request GET \
http://localhost:3000/
p=30;
for (( i=1; i<p; i++ )); do

	echo "registering josh$i"
	curl \
	--request GET \
	http://localhost:3000/register/josh$i/mccloskey/j@email.com/9262221111
done


printf " testing loging\n" 

curl \
--request GET \
http://localhost:3000/login/joshua/mccloskey

printf "testing get friend list \n"

curl \
--request GET \
http://localhost:3000/getFriendList/joshua

printf "getting pending friends \n"

curl \
--request GET \
http://localhost:3000/getPendingFriends/joshua






