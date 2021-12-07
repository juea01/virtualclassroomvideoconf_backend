var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
    {
        customer: {type: String, requried: true},
        address: {type: String, requried: true},
        city: {type: String, requried: true},
        state: {type: String, requried: true},
        postalCode: {type: Number, requried: true},
        country: {type: String, requried: true},
        shipped: {type: Boolean},
        cart:{
             lines: [
               {product:{type: Schema.Types.ObjectId, ref: 'Product'},quantity:{type: Number}}
              ],
            itemCount: {type: Number, required: true},
            price: {type: Number, required: true}
        }
    }
);

OrderSchema.virtual('url').get(function(){return '/order/' + this._id});

module.exports = mongoose.model('Order',OrderSchema);