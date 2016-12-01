var express = require('express');
var path = require('path');;
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./libs/log')(module);

var index = require('./routes/index');
var articles = require('./routes/articles');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(index);
app.use(articles);

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
