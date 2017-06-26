# README #


### Using REST API ###

Method | Path                                              | Description | Example
------------- | ----------------------------------------- | ---------------| ----------
POST       | /api/photos                                | Upload photo | curl -v -s -X POST -H '' -F 'raw_data=@data.jpg;type=image/jpeg' -F title="new t-shirt.." -F tags="party,holiday" -F userId=511617851 localhost:5000/api/photos
GET         | /api/photos                                | List photos metadata |  curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos
GET         | /api/photos/:id                           | Get photo download link | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos/54c4194b8c6766d807779977
DELETE  | /api/photos/:id| Delete photo | curl -H 'Content-Type:application/json' -X DELETE localhost:5000/api/photos/54c4194b8c6766d807779977
GET         | /api/photos/:id/meta| Get photo details | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos/54c4194b8c6766d807779977/meta
PUT         | /api/photos/:id/meta| Update photo details (replaces whole content with new) | curl -H 'Content-Type:application/json' -X PUT -d '{"attribute" : "value"}' localhost:5000/api/photos/54c4194b8c6766d807779977/meta
GET         | /api/photos/:id/comments| Get comments for this photo | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos/54c4194b8c6766d807779977/comments
GET         | /api/photos/:id/likes| Get likes count for this photo, to get users IDs use /api/photos/:id/meta | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos/54c4194b8c6766d807779977/likes
GET | /api/photos/:id/dislikes|  Get dislikes count for this photo, to get users IDs use /api/photos/:id/meta | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/photos/54c4194b8c6766d807779977/dislikes
POST | /api/photos/:id/likes/:userId| Increments likes for this user | curl -H 'Content-Type:application/json' -X POST localhost:5000/api/photos/54c4194b8c6766d807779977/likes/511617851
DELETE | /api/photos/:id/likes/:userId| Removes likes for this user | curl -H 'Content-Type:application/json' -X DELETE localhost:5000/api/photos/54c4194b8c6766d807779977/likes/511617851
POST | /api/photos/:id/dislikes/:userId| Increments dislikes for this user  | curl -H 'Content-Type:application/json' -X POST localhost:5000/api/photos/54c4194b8c6766d807779977/dislikes/511617851
DELETE | /api/photos/:id/dislikes/:userId| Removes dislikes for this user | curl -H 'Content-Type:application/json' -X DELETE localhost:5000/api/photos/54c4194b8c6766d807779977/dislikes/511617851
GET | /api/users/:userId/photos| Gets photos list for this user |  curl -H 'Content-Type:application/json' -X GET localhost:5000/api/users/511617851/photos
POST | /api/comments| Adds comment to a photo for a user | curl -H 'Content-Type:application/json' -X POST -d '{"userId" : "511617851", "photoId": "54c4194b8c6766d807779977", "text" : "You look lovely in this mini strings!!" }' localhost:5000/api/comments
GET | /api/comments| Lists comments | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/comments
GET | /api/comments/:id| Gets a comment | curl -H 'Content-Type:application/json' -X GET localhost:5000/api/comments/54c6d0fe3f5790f12f70d42a
PUT | /api/comments/:id| Updates a comment | curl -H 'Content-Type:application/json' -X POST -d '{"userId" : "511617851", "photoId": "54c4194b8c6766d807779977", "text" : "Whaaa. what a monster ass!!" }' localhost:5000/api/comments/54c6d0fe3f5790f12f70d42a
DELETE | /api/comments/:id| 

### How do I get set up? ###

* Install nodejs

Download from http://nodejs.org/ and install 

* Pull this repo
~~~~
git clone https://github.com/piczmar/nodejs-social-starter.git
~~~~

* Install dependencies
~~~~
npm install
~~~~
* Database configuration

DB url is hardcoded in server.js

* Run
~~~~
node server.js
~~~~
or
~~~~
npm start
~~~~

### Public API ###

This API is also available at https://localhost:5000
You can use it like this:
curl -H 'Content-Type:application/json' -X GET https://localhost:5000/api/users/511617851/photos

### More features ###

The API supports sorting and paging, e.g.:

https://localhost:5000/api/users/123123213/photos?sort={"uploadDate":-1}&max=5&skip=10

### TODO ###
 Add support for filtering by criteria, e.g.: criteria={ title : { $regex: /pattern/} }