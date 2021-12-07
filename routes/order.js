var express = require('express');
var router = express.Router();

//Controller modules
var order_controller = require('../controllers/orderController');
router.put("/:id",order_controller.update_order);
router.delete("/:id",order_controller.delete_order);
router.post('/',order_controller.order_create_post);
router.get('/',order_controller.order_list);

module.exports = router;