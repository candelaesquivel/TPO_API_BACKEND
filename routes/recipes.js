var express = require('express')
var router = express.Router()
var RecipeController = require('../controllers/recipes.controller');
var Authorization = require('../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', RecipeController.getRecipes)
router.get('/my-recipes', Authorization, RecipeController.getRecipesByEmail)
router.post('/update-recipe', Authorization, RecipeController.updateRecipe)
router.post('/delete/', Authorization, RecipeController.deleteRecipe)
router.post('/calify', Authorization, RecipeController.califyRecipe)
router.post('/create', Authorization, RecipeController.createRecipe)

// Export the Router
module.exports = router;
