var express = require('express');
var router = express.Router();

//Controller modules
var product_Controller = require('../controllers/productController');

router.put("/:id",product_Controller.update_product);
router.delete("/:id",product_Controller.delete_product);
router.get('/',product_Controller.product_list);
router.post('/',product_Controller.product_create_post);

module.exports = router;