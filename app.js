
var siofu = require("socketio-file-upload");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config();
var logger = require('morgan');



//routs
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chat = require('./routes/chat');
var errorRouter = require('./routes/error');
var fileSharing = require('./routes/fileSharing');
var forum = require('./routes/forum');
var friends = require('./routes/friends');
var followers = require('./routes/followers');
var landingPage = require('./routes/landingPage');


var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json())
app.use(siofu.router)

      
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'classes_server')));
app.use(express.static(path.join(__dirname, 'filesAndImages')));
app.use(express.static(path.join(__dirname, 'classes_server')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chat);
app.use('/fileSharing', fileSharing)
app.use('/forum', forum);
app.use('/friends', friends);
app.use('/followers', followers);
app.use('/landingPage',landingPage);
app.use('/error', errorRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
