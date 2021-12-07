const {v4: uuidv4} = require("uuid")

const {body, validationResult} = require('express-validator');

exports.room_redirect = function(req,res,next) {

   res.redirect(`/room/${uuidv4()}`);

};

exports.render_room_id = function(req,res,next) {
    console.log(req.params);
    res.json({roomId: req.params.id});
 
 };

