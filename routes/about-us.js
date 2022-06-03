var express = require('express')
var router = express.Router()


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/about-us');
});

// Export the Router
module.exports = router;
