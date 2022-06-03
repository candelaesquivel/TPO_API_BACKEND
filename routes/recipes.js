var express = require('express')
var router = express.Router()
var RecipeController = require('../controllers/recipes.controller');



// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', RecipeController.getRecipes)
router.get('/my-recipes', RecipeController.getRecipesByEmail)
router.post('/update-recipe', RecipeController.updateRecipe)

// Export the Router
module.exports = router;
