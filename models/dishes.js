const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true,
    },
    comment: {
        type: String,
        require: true
    },
    author: {
        /* Check README -> Mongoose Population */
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    usePushEach: true, //push is deprecated by mongoose, I'm using usePushEach flag in dishSchema to make it work
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes