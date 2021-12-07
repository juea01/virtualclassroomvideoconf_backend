var express = require('express');
var router = express.Router();
const {v4: uuidv4} = require("uuid")

//Controller modules
var room_Controller = require('../controllers/roomController');

router.get("/:id",room_Controller.render_room_id);
router.get('/',room_Controller.room_redirect);



module.exports = router;