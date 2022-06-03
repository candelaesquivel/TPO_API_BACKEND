var express = require('express')
var router = express.Router()
var UserController = require('../controllers/users.controller');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.body)
    res.send('Llegaste a la ruta de  api/user');
});

router.post('/modify', UserController.updateUser)

// Export the Router
module.exports = router;
