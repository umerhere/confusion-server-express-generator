var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
const url = config.mongoUrl;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected to DB Server");
}, (err) => {
  console.log(err);
});

var app = express();

app.all('*', (req, res, next) => { //* means for ALL the requests
  if(req.secure) { //req comming from secure port has .secure attribute with them
     return next();
  } else {
    //Now redirect the Http request to Https server
    //req have these values used below
    //307 means target resource resides on a different URI
    res.redirect(307, 'https://' + req.hostname + ":" + app.get('secPort') + req.url)
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*  see /login route. there, passport.authenticate('local') will be called, if it gets true, it will add a User property in the req
      and User.serialize() will be called to store the req.User.username and req.User.password in the session*/
app.use(passport.initialize());

/* We have moved it here so that login/signup takes place before authentication ( public routes ) */
app.use('/users', usersRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
