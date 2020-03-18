var createError = require('http-errors');
var express = require('express');
var path = require('path');
var hike = require('./routes/hike');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var application = express();
application.get('/hikes', hike.index);
application.post('/add_hike', hike.add_hike);

// view engine setup
application.set('views', path.join(__dirname, 'views'));
application.set('view engine', 'jade');

application.use(logger('dev'));
application.use(express.json());
application.use(express.urlencoded({ extended: false }));
application.use(cookieParser());
// application.use(express.static(path.join(__dirname, 'public')));

application.use('/', indexRouter);
application.use('/users', usersRouter);

// catch 404 and forward to error handler
application.use(function(req, res, next) {
  next(createError(404));
});

// error handler
application.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

exports.index = function(req, res) {
  res.render('hike', {title: 'My Hiking Log'});
};

exports.add_hike = function(req, res) {
};

module.exports = application;
