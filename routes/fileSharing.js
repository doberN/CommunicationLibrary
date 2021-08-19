var express = require('express');
var router = express.Router();

const db = require('../sequelize/models/index.js');

var FileSharing = require('../classes_server/fileSharing.js');
const fileSharing = new FileSharing();

router.post('/fileList', async function(req, res, next) {
  const domain = req.headers.referer;
  const lastFile = req.body.lastFile;
  const files = await fileSharing.getFiles(domain, lastFile);
  res.send({result:files});
  });

module.exports = router;