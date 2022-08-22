var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

//User.authenticate() is provided by passport-local-mongoose. if we ain't using it, we need to provide here our own authenticate method
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//User.serializeUser() and deserialize() are provided by passport-local-mongoose.
//these serialization/deserialization will take care of support for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 //1 hour
    }); //will create a token and return to us
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //you can extract jwt token from various options like auth, body etc etc
opts.secretOrKey = config.secretKey;

//jwt passport strategy
exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {  //verify function, when success , done is callback which will pas back the info to passport
        console.log("JWT Payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                //this done is a callback that passport will pass to our strategy 
                return done(err, false); //we're passing false here instead of user as its a error if case
            } else if (user) {
                return done(null, user); //no error here
            } else {
                return done(null, false);
            }
        })
    }
));

//read README.md for better understanding
exports.verifyUser = passport.authenticate('jwt', {session: false});
