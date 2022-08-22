var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

//User.authenticate() is provided by passport-local-mongoose. if we ain't using it, we need to provide here our own authenticate method
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//User.serializeUser() and deserialize() are provided by passport-local-mongoose.
//these serialization/deserialization will take care of support for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());