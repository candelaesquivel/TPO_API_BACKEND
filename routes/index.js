var express = require('express');
var router = express.Router();
var RecipeController = require('../controllers/recipes.controller')

/* GET home page. */
router.post('/', RecipeController.getRecipes)
router.post('/home', RecipeController.getRecipes);

module.exports = router;
