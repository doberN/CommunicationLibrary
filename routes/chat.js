var express = require('express');
var router = express.Router();

const db = require('../sequelize/models/index.js');

var Chat = require('../classes_server/chat.js');
const chat = new Chat();

router.post('/messageList', async function(req, res, next) {
   const domain = req.headers.referer;
   const lastMessage = req.body.lastMessage;
   const messageObj = await chat.getMessage(domain, lastMessage);
  res.send({result:messageObj});
    
  });

module.exports = router;