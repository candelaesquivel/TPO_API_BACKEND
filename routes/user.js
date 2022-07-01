var express = require('express')
var router = express.Router()
var UserController = require('../controllers/users.controller');
var Authorization = require('../../auth/authorization');



// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.post('/register', UserController.createUser)
router.post('/login', UserController.loginUser)

// Solamente por ejemplo
router.get('/users', Authorization, UserController.getUsers)



// Export the Router
module.exports = router;



//api/users
//api/users/registration
//api/users/login