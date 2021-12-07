var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
    {
        name: {type: String, requried: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        country: {type: String, required: true},
        city: {type: String, required: true},
        postCode: {type: Number, required: true}
        
    }
);

CustomerSchema.virtual('url').get(function(){return '/customer/' + this._id});

module.exports = mongoose.model('Customer',CustomerSchema);