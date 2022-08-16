var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

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
app.use(cookieParser());

function auth (req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if (!authHeader) { //if its null,  means no username password given
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);//here we are sending the err to client 
      //the server will send client a response in this form -> HTTP/1.1 401 Unauthorized WWW-Authorize: Basic
      return;
  }
  
  /*Now to access a page index.html, the client have to send the server a request in this form -> GET/index.html HTTP/1.1 Authorization: Basic Base64EcnodedString Host: www.cse.ust.uk
    Where Base64EcnodedString contains username and password */
  
  //Creating the ubove commented request below
  /*here, authHeader = Basic Base64EcnodedString. We're splitting it on space, the whole string will convert into array as "[0] = Basic & [1] = Base64EcnodedString"
   and we're accessing the 1st index that would be Base64EcnodedString and again spliting it as Base64EcnodedString contains username and passowrd in 
   the form -> username:password */
  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') {
      next(); // authorized, Now, we are good to go down to run the following middlewares
  } else {
    var err = new Error('You are not authenticated');
    res.setHeader('WWW-Autheticate', 'Basic');
    err.status = 401;
    next(err); //here we are sending the err to client 
  }
}

//All ubove middlewares run till this point
app.use(auth); //Authentication, if true the next middlewares (lines) will be accessbile to client

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
