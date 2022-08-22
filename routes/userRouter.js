var express = require('express');
var bodyParser = require('body-parser'); 
var Users = require('../models/users');
var passport = require('passport');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {

  //passport-local-mongoose provide the method of register
  /*we are expecting username and passowrd to be passed in the body of request, 
    earlier, we were passing the username and password in the authentication header  */
  Users.register(new Users({username: req.body.username}), 
    req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    })
});

/*we are expecting username and passowrd to be passed in the body of request, 
  earlier, we were passing the username and password in the authentication header  */
//now passport.authenticate('local') will run first, if successfull, then next callback will be called
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'Login Successful!'});
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('Not logged in');
    err.status = 403;
    next(err); //here we are sending the err to client 
  }
})

module.exports = router;
