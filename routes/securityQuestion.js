var express = require('express')
var router = express.Router()
var UserController = require('../controllers/users.controller');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.post('/', UserController.getSecurityQuestionUser)
router.post('/answer', UserController.checkSecurityAnswer)

// Export the Router
module.exports = router;