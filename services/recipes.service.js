// Gettign the Newly created Mongoose Model we just created 
var Recipe = require('../models/Recipe.model');
var CalificationUsers = require('../models/CalificationUser.model');
var User = require('../models/User.model');

var ServiceException = require('../exceptions/serviceException').ServiceException;
var ErrorCodes = require('../exceptions/serviceException').ErrorCodes;

// Saving the context of this module inside the _the variable
_this = this
var mongoose = require('mongoose');

//configurar cloudinary
const cloudinary = require('cloudinary').v2;

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
        throw new ServiceException('Error al consultar las recetas', ErrorCodes.ERROR_IN_DB_OPERATION);
    }
}

exports.updateRecipe = async function (recipe) {
    
    try {
        //Find the old User Object by the Id
        var oldRecipe = await Recipe.findOne({idRecipe : recipe.id});
    } catch (e) {
        console.log(e);
        throw new ServiceException("Error al buscar la receta", ErrorCodes.ERROR_IN_DB_OPERATION);
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
        throw new ServiceException("Error al actualizar la receta", ErrorCodes.ERROR_IN_DB_OPERATION);
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
            throw new ServiceException("Error al borrar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
        }
        return deleted;
    } catch (e) {
        console.log(e);
        throw new ServiceException("Error al borrar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}

exports.createRecipe = async function(recipe){

    console.log("Enter in Service");
    try {
        var recipes = await Recipe.find({});
        var isEmpty = recipes.length === 0;

        console.log('Recipes: ', recipes)
        console.log('IsEmpty: ', isEmpty)

        var maxId = 0;
        if (!isEmpty)
            maxId = await Recipe.find({}).sort({'idRecipe' : -1}).limit(1).then(doc => doc[0].idRecipe);

        console.log("MaxDoc", maxId);

    }catch (e){
        console.log(e);
        throw new ServiceException("Error mientras se creaba la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }

    var newRecipe = new Recipe({
        idRecipe: maxId + 1,
        name: recipe.name,
        ingredients: recipe.ingredients,
        categories: recipe.categories,
        difficulty: recipe.difficulty,
        process : recipe.process,
        averageMark: recipe.averageMark,
        countMark: recipe.countMark,
        photo: recipe.photo,
        publicationStatus : recipe.state,
        userEmail: recipe.userEmail
    })

    console.log("Back Recipe Create: ", newRecipe)

    // create the recipe
    try {
        var exists = await Recipe.exists({idRecipe : newRecipe.idRecipe})
        console.log("Exist Recipe: ", exists)
        if (!exists)
        {
            var savedRecipe = await newRecipe.save();
            console.log("Recipe Created")
            return savedRecipe;
        }
        else
            throw new ServiceException("Receta ya existente con ese id", ErrorCodes.ERROR_RECIPE_ID_IN_USE)
        
    } catch (e) {
        console.log(e);
        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error mientras se creaba la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
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
        throw new ServiceException("Error al buscar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
    // If no old User Object exists return false
    if (!oldRecipe) {
        throw new ServiceException("Receta no encontrada", ErrorCodes.ERROR_RECIPE_NOT_FOUND)
    }

    try {
        var userExist = await User.exists({email : email})
        if (!userExist)
            throw new ServiceException("El usuario calificador no existe", ErrorCodes.ERROR_MAIL_NOT_ASSOCIATED)
    } catch (e) {
        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error al calificar la receta con los datos del usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
    }

    try {
        var existCalification = await CalificationUsers.exists({email: email , idRecipe : recipe.idRecipe})
    } catch (e) {
        throw new ServiceException("Error al calificar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }

    if (!existCalification){
        oldRecipe.countMark = oldRecipe.countMark + 1
        oldRecipe.averageMark += calification
        oldRecipe.averageMark = oldRecipe.averageMark / oldRecipe.countMark
    }
    else{
        throw new ServiceException("Una receta no puede ser calificada 2 veces por el mismo usuario", ErrorCodes.ERROR_DUPLICATE_CALIFY)
    }

    try {
        var recipeUpdated = await oldRecipe.save();
    }
    catch(e){
        console.log(e)
        throw new ServiceException("Error al calificar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }

    try {
        await newCalify.save();
    }
    catch(e){
        console.log(e)
        throw new ServiceException("Error al calificar la receta", ErrorCodes.ERROR_IN_DB_OPERATION)
    }

    return recipeUpdated
}


exports.createRecipeImg = async function(imageData) {
    //subir imagen a cloudinary
    const imagen = process.env.UPLOAD_DIR + imageData.imageName;

    try {
        let result = await cloudinary.uploader.upload(imagen);
        return result.secure_url;

    }catch (e){
        console.log(e);
        throw ServiceException('Error en el proceso de carga de la imagen', ErrorCodes.ERROR_IN_DB_OPERATION)
    }


}