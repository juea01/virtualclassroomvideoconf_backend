var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema(
    {
        name: {type: String, requried: true},
        category: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true}
    }
);

ProductSchema.virtual('url').get(function(){return '/product/' + this._id});

module.exports = mongoose.model('Product',ProductSchema);