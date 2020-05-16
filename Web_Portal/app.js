var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var crud = require('./routes/crud');
var rides = require('./routes/rides');
var passport = require('passport');
require('./passport')(passport)
var mongoose = require('mongoose');
var session = require('express-session');
var auth = require('./routes/auth')(passport);
var flash = require('express-flash-notification');
var app	=	express();
var Message= require('./db/message');


mongoose.connect('mongodb://localhost:27017/login', { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
         console.log("Running!");

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join("C://Users/Umar/Documents/GitHub/FYP-Project/ML_Python/", 'uploads')));
app.use(session({
  secret:'thesecret',
  saveUninitialized:false,
  resave:false
}));
app.use(flash(app));
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/crud', crud);
app.use('/rides', rides);

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
