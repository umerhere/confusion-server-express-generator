const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    label: {
        type: String,
        default: 'New'
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Promos = mongoose.model('Promo', promoSchema);
module.exports = Promos