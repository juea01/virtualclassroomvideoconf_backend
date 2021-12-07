var Product = require('../model/product');
const {v4: uuidv4} = require("uuid")

const {body, validationResult} = require('express-validator');

exports.room_redirect = function(req,res,next) {

   res.redirect(`/room/${uuidv4()}`);

};

exports.render_room_id = function(req,res,next) {
    console.log(req.params);
    res.json({roomId: req.params.id});
 
 };

exports.product_create_post = [
    
    //here is validation
   //body('cart.lines.*').escape(),

   (req,res,next) => {
       console.log(req.body);

       const errors = validationResult(req);
       console.log("create product method");
       var product = new Product(
        {name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price}
        );

        if(!errors.isEmpty()) {
            console.log(error);
            res.json({message: 'Invalid create request'});
        } else {
           product.save(function (err){
               if (err) {
                 console.log(err);
                 return next(err);
               }
               res.json({message: 'Your product has been successfully created. Thanks.',
                        id: product._id});
            });
        }
   }
];

exports.update_product = function(req,res,next) {
    console.log("update product method");

             if (typeof req.params.id === 'undefined') {
                 console.log("Invalid Update Request");
                 res.json({message: 'Invalid delete request',id: req.params.id});
             
           } else {
               const errors = validationResult(req);
               var product = new Product(
                            {name: req.body.name,
                                category: req.body.category,
                                description: req.body.description,
                                price: req.body.price,
                                _id: req.params.id}
                            );
                if(!errors.isEmpty()) {
                    console.log(error);
                    res.json({message: 'Invalid update request'});
                } else {
                    Product.findByIdAndUpdate(req.params.id, product, {}, function (err){
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    res.json({message: 'Your product has been successfully updated. Thanks.'});
                    });
                }
           }
}


exports.delete_product = function(req,res,next) {
    console.log("delete product method");

           if(!(typeof req.params.id === 'undefined')){
               Product.deleteOne({_id: req.params.id}).then(result => {
                   console.log(`Delete ${req.params.id} is successfully deleted`);
                   res.json({message: 'Your product has been successfully deleted. Thanks.',id: req.params.id});
               });
           } else {
            res.json({message: 'Invalid delete request',id: req.params.id});
            } 
}