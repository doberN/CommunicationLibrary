var Friends = require('../classes_server/friends.js');
const friends = new Friends();

var User = require('../classes_server/user.js');
const user = new User();

var express = require('express');
var router = express.Router();

router.post('/createFriend', user.userAutenticate,async function(req, res, next) {
    const friendOne = req.user.userId;
    const friendTwo = req.body.profileId;
    const result =  await friends.create(friendOne, friendTwo);
    res.send(result);
  });

  router.post('/removeFriend', user.userAutenticate,async function(req, res, next) {
    const friendOne = req.user.userId;
    const friendTwo = req.body.profileId;
    const result =  await friends.remove(friendOne, friendTwo);
    res.send(result);
  });

  router.get('/friendList', user.userAutenticate,async function(req, res, next) {
    const userId = req.user.userId;
    const result =  await friends.FriendList(userId);
    res.send({result});
  });

module.exports = router;