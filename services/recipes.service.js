// Gettign the Newly created Mongoose Model we just created 
var Recipe = require('../models/Recipe.model');
var CalificationUsers = require('../models/CalificationUser.model');
var User = require('../models/User.model');

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
        var oldRecipe = await Recipe.findOne({idRecipe : recipe.id});
    } catch (e) {
        console.log(e);
        throw Error("Error occured while Finding the Recipe")
    }
    // If no old User Object exists return false
    if (!oldRecipe) {
        console.log('Receta No encontrada')
        return false;
    }
    else
        console.log("Old Recipe Servicio: ", oldRecipe)
    
    console.log(oldRecipe);

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
        var savedRecipe = await oldRecipe.save();
        return savedRecipe;
    } catch (e) {
        console.log("Exception: ", e);
        throw Error("And Error occured while updating the Recipe");
    }
}


exports.deleteRecipe = async function(idRecipe){
    // Delete the recipe
    try {
        var deleted = await Recipe.deleteOne({
            _id: idRecipe
        })

        console.log(deleted)

        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("REcipe Could not be deleted")
        }
        return deleted;
    } catch (e) {
        console.log(e);
        throw Error("Error Occured while Deleting the Recipe")
    }
}

exports.createRecipe = async function(recipe){

    var newRecipe = new Recipe({
        idRecipe: recipe.idRecipe,
        name: recipe.name,
        ingredients: recipe.ingredients,
        categories: recipe.categories,
        difficulty: recipe.difficulty,
        process : recipe.process,
        averageMark: recipe.averageMark,
        countMark: recipe.countMark,
        photo: recipe.photo,
        publicationStatus : recipe.publicationStatus,
        userEmail: recipe.userEmail
    })

    // create the recipe
    try {
        var exists = await Recipe.exists({idRecipe : newRecipe.idRecipe})

        if (!exists)
        {
            var savedRecipe = await newRecipe.save();
            return savedRecipe;
        }
        else
            throw Error("Id Recipe is being used by another recipe")
        
    } catch (e) {
        throw Error("Error Occured while creating the Recipe")
    }
}

exports.califyRecipe = async function (email, calification, recipe ) {
    var newCalify = new CalificationUsers({
        email: email,
        calification: calification,
        idRecipe: recipe.idRecipe
    })

    try {
        var oldRecipe = await Recipe.findOne({idRecipe : recipe.idRecipe})
    } catch (e) {
        console.log(e)
        throw Error("Error occured while Finding the Recipe")
    }
    // If no old User Object exists return false
    if (!oldRecipe) {
        throw Error('Recipe not found')
    }

    try {
        var userExist = await User.exists({email : email})
        if (!userExist)
            throw Error("The mail of calify user don't exist in DB")
    } catch (e) {
        throw Error("Error occured while Finding the Email at the user databases")
    }

    try {
        var existCalification = await CalificationUsers.exists({email: email , idRecipe : recipe.idRecipe})
    } catch (e) {
        throw Error("Error occured while Finding the Califications")
    }

    if (!existCalification){
        oldRecipe.countMark = oldRecipe.countMark + 1
        oldRecipe.averageMark += calification
        oldRecipe.averageMark = oldRecipe.averageMark / oldRecipe.countMark
    }
    else{
        throw Error('Error: A user can not calify two times the same recipe')
    }

    try {
        var recipeUpdated = await oldRecipe.save();
    }
    catch(e){
        console.log(e)
        throw Error('Error: Recipe Mark can not be updated')
    }

    try {
        await newCalify.save();
    }
    catch(e){
        console.log(e)
        throw Error('Error: Calification can not be updated')
    }

    return recipeUpdated
}
