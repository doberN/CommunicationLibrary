var express = require('express');
var router = express.Router();

const db = require('../sequelize/models/index.js');

var Forum = require('../classes_server/forum.js');
const forum = new Forum();

router.post('/getThreadList', async function(req, res, next){
  const domain = req.headers.referer;
  const lastThread = req.body.lastThread;
  const threadsObj = await forum.getThreads(domain, lastThread);
  res.send({result:threadsObj});
});
router.post('/getCommentList', async function(req, res, next){
  const lastComment = req.body.lastComment;
  const parent = req.body.parent;
  const commetnsObj = await forum.getComments( lastComment, parent);
  res.send({result:commetnsObj});
});

module.exports = router;