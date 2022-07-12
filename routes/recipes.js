var express = require('express')
var router = express.Router()
var RecipeController = require('../controllers/recipes.controller');
var Authorization = require('../auth/authorization');
var UploadController = require('../controllers/upload.controller');

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.post('/view-recipe', Authorization, RecipeController.getRecipeById)
router.post('/my-recipes', Authorization, RecipeController.getRecipesByEmail)
router.post('/update-recipe', Authorization, RecipeController.updateRecipe)
router.post('/delete/', Authorization, RecipeController.deleteRecipe)
router.post('/calify', Authorization, RecipeController.califyRecipe)
router.post('/create', Authorization, RecipeController.createRecipe)
router.post('/uploadImage', Authorization, UploadController.uploadFiles)
router.post('/saveRecipeImg', Authorization, RecipeController.uploadRecipeImage)


// Export the Router
module.exports = router;
