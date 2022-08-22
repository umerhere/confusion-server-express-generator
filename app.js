var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/confusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected to DB Server");
}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Lets use signed cookie. We are using this value 12345-67890-09876-54321 as our signature 
//app.use(cookieParser('12345-67890-09876-54321')); 

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

/*  see /login route. there, passport.authenticate('local') will be called, if it gets true, it will add a User property in the req
      and User.serialize() will be called to store the req.User.username and req.User.password in the session*/
app.use(passport.initialize());
app.use(passport.session());

/* We have moved it here so that login/signup takes place before authentication ( public routes ) */
app.use('/users', usersRouter);
app.use('/', indexRouter);

function auth (req, res, next) {
  console.log(req.user);
  //req.user is added by passport.authenticate('local') in /login route
  if(!req.user) {
      var err = new Error('You are not authenticated 1!');
      err.status = 403;
      return next(err);
  }
  else {
    next();
  }
}

//All ubove middlewares run till this point
app.use(auth); //Authentication, if true the next middlewares (lines) will be accessbile to client

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);

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
