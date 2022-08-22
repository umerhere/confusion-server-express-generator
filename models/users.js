const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const userSchema = new Schema({
    //username and password will be provided by passport-local-mongoose
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

var Users = mongoose.model('User', userSchema);
module.exports = Users