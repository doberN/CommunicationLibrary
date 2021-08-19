var Followers = require('../classes_server/followers.js');
const followers = new Followers();

var User = require('../classes_server/user.js');
const user = new User();

var express = require('express');
var router = express.Router();

router.post('/createFollower', user.userAutenticate,async function(req, res, next) {
    const followingId = req.user.userId;
    const followedId = req.body.profileId;
    const result =  await followers.create(followingId, followedId);
    res.send(result);
  });
  
  router.post('/removeFollower', user.userAutenticate,async function(req, res, next) {
    const followingId = req.user.userId;
    const followedId = req.body.profileId;
    const result =  await followers.remove(followingId, followedId);

    res.send(result);
  });

  router.get('/followedList', user.userAutenticate,async function(req, res, next) {
    const userId = req.user.userId;
    const result =  await followers.followedList(userId);
    res.send({result});
  });

  router.get('/followersList', user.userAutenticate,async function(req, res, next) {
    const userId = req.user.userId;
    const result =  await followers.followersList(userId);
    res.send({result});
  });

  

module.exports = router;