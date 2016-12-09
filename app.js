var express = require('express');
var path = require('path');;
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./libs/log')(module);
var passport = require('passport');

var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require(libs + 'config');
var oauth2 = require(libs + 'auth/oauth2');
var log = require(libs + 'log')(module);

var articles = require('./routes/articles');
var users = require('./routes/users');
var api = require('./routes/api');
var auth = require('./routes/oauth');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());


app.use(api);
app.use(users);
app.use(articles);
app.use('/api/oauth/token', oauth2.token);
app.use(auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  log.debug('%s %d %s', req.method, res.statusCode, req.url);
  res.json({ 
    error: 'Not found' 
  });
  return;
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  log.error('%s %d %s', req.method, res.statusCode, err.message);
  res.json({ 
    error: err.message 
  });
  return;
});

module.exports = app;
