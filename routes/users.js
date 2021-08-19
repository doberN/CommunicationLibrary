var express = require('express');
var router = express.Router();



var User = require('../classes_server/user.js');
const db = require('../sequelize/models/index.js');
const user = new User();
const logger = require('../logger.js')
 
router.post('/signUp', async function(req, res, next) {
  const userDetails = req.body;

  const objectSuccessOrFailure  = await user.signUp(userDetails)
  res.send(objectSuccessOrFailure);
});   

router.get('/signUp/authentication', async function(req, res, next) {
    const emailUserJwt = req.query.param;
    const active = user.doActiveUser(emailUserJwt);

    if(!active) return "you can't active";
    res.render('activeUser');
}); 

router.post('/login', async function(req, res, next) {
    const userDetails = req.body;
    const exist = await user.login(userDetails);

    res.send (exist)
}); 

router.post('/forgotPassword', async function (req, res, next) {
    const email = req.body.email;
    const result = await user.forgot(email);

    res.send(result);
});

router.get('/checkLinkForgotPassword', async function (req, res, next) {
    const jwtResetPassword = req.query.param

    const result = await user.checkTokenResetPassword(jwtResetPassword);
    if(!result) return res.sendStatus(403)

    res.render('resetPassword', { token:result.jwtResetPassword });
});

router.post('/resetPassword', async function (req, res, next){
 
    const token = req.body.token;
    const password = req.body.password;
    const resetPassword = await user.resetPassword(token, password);
    if(!resetPassword) return res.sendStatus(403);

    res.send(resetPassword);
});

router.get('/updateUser', user.userAutenticate, async function (req, res, next) {
  try{
    userDetails = await user.detailsForUpdate(req.user);
 
    res.send(userDetails);
    logger.info('was update')
  }catch(err){
    logger.error(JSON.stringify(err))
  }

});


router.post('/updateUser', user.userAutenticate, user.checklegalFile(), async function (req, res, next) {
  req.body.userId = req.user.userId;

  if('file' in req){
    req.body.image = Date.now()+'.'+req.file.originalname.split('.')[1];
    req.body.file = req.file;
  }
  else if('default' in req.body){
    req.body.image = 'user23454644322456765545.jpg';
  } 
 
    const userDetails = req.body;
    const objectSuccessOrFailure  = await user.updateUser(userDetails);
    res.send(objectSuccessOrFailure);
    
});

router.post('/profile', async function(req, res, next) {
  const userId = req.body.userId;
  const result =  await user.profile(userId);

  res.send(result);
});

module.exports = router;
