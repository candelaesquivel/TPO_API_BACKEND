var RecipeService = require('../services/recipes.service');

// Saving the context of this module inside the _the variable
_this = this;

exports.getRecipes = async function (req, res, next){

     // Check the existence of the query parameters, If doesn't exists assign a default value
     var page = req.query.page ? req.query.page : 1
     var limit = req.query.limit ? req.query.limit : 10;
     try {
         var Recipes = await RecipeService.getRecipes({}, page, limit)
         // Return the Users list with the appropriate HTTP password Code and Message.
         return res.status(200).json({status: 200, data: Recipes, message: "Succesfully Recipes Recieved"});
     } catch (e) {
         //Return an Error Response Message with Code and the Error Message.
         return res.status(400).json({status: 400, message: e.message});
     }
}

exports.getRecipesByEmail = async function (req, res, next){

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    var email = req.body.email;
    try {
        var Recipes = await RecipeService.getRecipes({userEmail : email}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Recipes, message: "Succesfully Recipes Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.updateRecipe = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.id) {
        return res.status(400).json({status: 400., message: "Id be present"})
    }
    
    var Recipe = {
        id : req.body.id,
        name:req.body.name ,
        ingredients: req.body.ingredients,
        idCategory: req.body.idCategory,
        difficulty:req.body.difficulty,
        process : req.body.process,
        averageMark: req.body.averageMark,
        countMark:req.body.countMark ,
        photo: req.body.photo,
        publicationStatus : req.body.publicationStatus,
        userEmail:req.body.userEmail 

    }

    console.log("Receta en Controller: ", Recipe);

    try {
        var updatedRecipe = await RecipeService.updateRecipe(Recipe)
        return res.status(200).json({status: 200, data: updatedRecipe, message: "Succesfully Updated Recipe"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}