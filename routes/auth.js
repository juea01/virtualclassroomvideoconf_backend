var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController');
/* GET users listing. */
router.post('/', authController.auth);

module.exports = router;
