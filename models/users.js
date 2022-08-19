const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Users = mongoose.model('User', userSchema);
module.exports = Users