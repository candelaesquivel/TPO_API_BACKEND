var express = require('express')
var router = express.Router()


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.body)
    res.send('Llegaste a la ruta de  api/user');
});

// Export the Router
module.exports = router;
