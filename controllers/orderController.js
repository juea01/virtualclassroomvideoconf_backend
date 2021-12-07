var Order = require('../model/order');
var rabbitMqPublisher = require('../rabbitmq/publisher');

const {body, validationResult} = require('express-validator');
var originalMessage = '';

exports.order_create_post = [
    
     // Convert the genre to an array.
     (req, res, next) => {
        if(!(req.body.cart.lines instanceof Array)){
            if(typeof req.body.cart.lines ==='undefined')
            req.body.cart.lines = [];
            else
            console.log("Converted to Array");
            req.body.cart.lines = new Array(req.body.cart.lines);
        } else {
            console.log("Array Type");
            originalMessage =  req.body;
             //transfor the format mongoose schema and mongo db  expect
            const transformOrder = req.body.cart.lines.map(function(p){ return {product: {_id: p.product.id, name: p.product.name, 
            description: p.product.description, category: p.product.category, buyingQuantity: p.product.buyingQuantity, 
            price: p.product.price},quantity:p.quantity}} );
            console.log(transformOrder);
            req.body.cart.lines = transformOrder;
        }
        next();
    },

    //body('cart.lines.*').escape(),

    (req,res,next) => {
        console.log(req.body);

        const errors = validationResult(req);
        console.log("Here");
        var order = new Order(
         {customer: req.body.name,
         address: req.body.address,
         city: req.body.city,
         state: req.body.state,
         postalCode: req.body.postalCode,
         country: req.body.country,
         shipped: req.body.shipped,
        cart: {
            lines:req.body.cart.lines,
            itemCount:req.body.cart.itemCount,
            price:req.body.cart.cartPrice
        }}
         );

         if(!errors.isEmpty()) {
             console.log(error);
             res.json({message: 'Invalid Order create request'});
         } else {
            order.save(function (err){
                if (err) {
                  console.log(err);
                  return next(err);
                }
                originalMessage.id = order._id;
                rabbitMqPublisher(originalMessage);
                res.json({message: 'Your order has been successfully received. Thanks.',id: order._id});
             });
         }
    }
];

exports.update_order = function(req,res,next) {
    console.log("update order method");

           if(!(req.body.cart.lines instanceof Array)){
               if(typeof req.body.cart.lines ==='undefined')
               req.body.cart.lines = [];
               else
               console.log("Converted to Array");
               req.body.cart.lines = new Array(req.body.cart.lines);
           } else {
               console.log("Array Type Update Order");
                //transfor the format mongoose schema and mongo db  expect
               const transformOrder = req.body.cart.lines.map(function(p){ return {product: {_id: p.product.id, name: p.product.name, 
               description: p.product.description, category: p.product.category, buyingQuantity: p.product.buyingQuantity, 
               price: p.product.price},quantity:p.quantity}} );
               console.log(transformOrder);
               req.body.cart.lines = transformOrder;

               const errors = validationResult(req);
               var order = new Order(
                            {customer: req.body.name,
                            address: req.body.address,
                            city: req.body.city,
                            state: req.body.state,
                            postalCode: req.body.postalCode,
                            country: req.body.country,
                            shipped: req.body.shipped,
                            _id: req.body.id,
                           cart: {
                               lines:req.body.cart.lines,
                               itemCount:req.body.cart.itemCount,
                               price:req.body.cart.cartPrice
                           }}
                            );
                 if(!errors.isEmpty()) {
                console.log(error);
                res.json({message: 'Invalid order update request'});
            } else {
                Order.findByIdAndUpdate(req.body.id, order, {}, function (err){
                   if (err) {
                     console.log(err);
                     return next(err);
                   }
                   res.json({message: 'Your order has been successfully updated. Thanks.',id: req.params.id});
                });
            }
           }
}


exports.delete_order = function(req,res,next) {
    console.log("delete order method");

           if(!(typeof req.params.id === 'undefined')){
               Order.deleteOne({_id: req.params.id}).then(result => {
                   console.log(`Delete ${req.params.id} is successfully deleted`);
                   res.json({message: 'Your order has been successfully deleted. Thanks.',id: req.params.id});
               });
           } else {
               res.json({message: 'Invalid order delete request'});
            } 
}

exports.order_list = function(req,res,next) {

    Order.find({}).populate('cart.lines.product').exec(function(err,order){
        if(err) { return next(err);}

        console.log(order.customer);
        //transfor the format (especially "id" key name (from _id to id)) that front end expect
        const transformOrder = order.map(function(o){ return {id: o._id, name: o.customer, 
             address: o.address, city: o.city, state: o.state, postalCode: o.postalCode, 
             country: o.country, shipped: o.shipped, cart: {
                
                lines: o.cart.lines.map(function(l){if (l.product != null) {return {product: {id: l.product._id, name: l.product.name, description: l.product.description, category: l.product.category,
                price: l.product.price},quantity: l.quantity}}}), 

                 itemCount:o.cart.itemCount, price:o.cart.price
             }} });
             //console.log(transformOrder);
        res.send(transformOrder);
    });

};