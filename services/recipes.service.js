// Gettign the Newly created Mongoose Model we just created 
var Recipe = require('../models/Recipe.model');

// Saving the context of this module inside the _the variable
_this = this
var mongoose = require('mongoose')

exports.getRecipes = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query)
        var Recipes = await Recipe.find(query).lean()
        // Return the Userd list that was retured by the mongoose promise
        console.log(Recipes);
        return Recipes;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Users');
    }
}

exports.updateRecipe = async function (recipe) {
    
    try {
        //Find the old User Object by the Id
        var oldRecipe = await Recipe.findById(recipe.id);
    } catch (e) {
        throw Error("Error occured while Finding the Recipe")
    }
    // If no old User Object exists return false
    if (!oldRecipe) {
        console.log('Receta No encontrada')
        return false;
    }
    else
        console.log("Old Recipe Servicio: ", oldRecipe)
 
    oldRecipe.name = recipe.name
    oldRecipe.ingredients = recipe.ingredients
    oldRecipe.idCategory = recipe.idCategory
    oldRecipe.difficulty = recipe.difficulty
    oldRecipe.process = recipe.process
    oldRecipe.averageMark = recipe.averageMark
    oldRecipe.countMark = recipe.countMark
    oldRecipe.photo = recipe.photo
    oldRecipe.publicationStatus = recipe.publicationStatus
    oldRecipe.email = recipe.email
    

    try {
        var savedRecipe = await oldRecipe.save()
        return savedRecipe;
    } catch (e) {
        throw Error("And Error occured while updating the Recipe");
    }
}