var express = require('express')
var router = express.Router()
var UserController = require('../controllers/users.controller');
var Authorization = require('../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.post('/modify', Authorization, UserController.updateUserData)
router.post('/modify-password', Authorization, UserController.updateUserPassword)

// Export the Router
module.exports = router;
