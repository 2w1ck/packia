var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// parse configuration
var config;
try{
  config = JSON.parse(fs.readFileSync('../config/server.json'));
}catch(err){
  throw Error(err);
}

// routers
var indexRouter = require('./routers/IndexRouter');

// setup express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// setup middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// bind routers into express
app.use('/', indexRouter);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// dev error handler
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {message: err.message, error: err });
	});
}

// prod error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {message: err.message, error: {}});
});

// start to listen for requests
var server = app.listen(config.port, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});

module.exports = app;