var express = require('express');
var router = express.Router();
const fs = require('fs')

router.get('/', async function(req, res, next) {


fs.readFile('./log/app.log', 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data);
    res.send(data)
    })  
  });

module.exports = router;