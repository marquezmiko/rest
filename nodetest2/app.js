var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

// Request
var request = require('request');
var inspect = require('eyespect').inspector();

var postData = {
  q: 'DuckDuckGo',
  format: 'json',
  pretty: '1'
}

var options = {
  method: 'GET',
  //body: postData,
  json: true,
  url: 'https://api.duckduckgo.com/?q=DuckDuckGo&format=json&pretty=1'
}

request(options, function (err, res, body) {
  if (err) {
    inspect(err, 'error posting json')
    return
  }
  var headers = res.headers
  var statusCode = res.statusCode
  //inspect(headers, 'headers')
  //inspect(statusCode, 'statusCode')
  inspect(body, 'body')
  //console.log(body.RelatedTopics[0]) 
 for (index = 0; index < body.RelatedTopics.length; ++index) {
    console.log(body.RelatedTopics[index].Text);
  }
});

//Routing
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
