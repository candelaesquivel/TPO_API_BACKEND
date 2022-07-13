var RecipeService = require('../services/recipes.service');

// Saving the context of this module inside the _the variable
_this = this;

const addFiltersToQuery = function(query, filters){

    const filterByDifficult = filters.difficulty !== 0
    const filterByName = filters.name !== ''
    const filterByCategories = filters.categories[0] !== ''

    if (filterByName)
        query.name = {$regex : '^' + filters.name, $options : 'i'}

    if (filterByDifficult)
        query.difficulty = filters.difficulty;

    if (filterByCategories)
        query.categories = { $all : filters.categories }

    return query
}

exports.getRecipes = async function (req, res, next){

     // Check the existence of the query parameters, If doesn't exists assign a default value
     var page = req.query.page ? req.query.page : 1
     var limit = req.query.limit ? req.query.limit : 10;
     var query = { publicationStatus : true }

     console.log("Body: ", req.body)

     var filters = {
        name : req.body.name,
        ingredients : req.body.ingredients.split(','),
        difficulty : parseInt(req.body.difficulty),
        categories : req.body.categories.split(',')
     }

     addFiltersToQuery(query, filters)

     try {
         var recipes = await RecipeService.getRecipes(query, page, limit)
         // Return the Users list with the appropriate HTTP password Code and Message.
         return res.status(201).json({status: 201, data: recipes, message: "Succesfully Recipes Recieved"});
     } catch (e) {
         //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
     }
}

exports.getRecipeById = async function (req, res, next){

    const id = req.body.idRecipe
    console.log('Recipe Id Backend: ', id);
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var recipe = await RecipeService.getRecipes({idRecipe : id})
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(201).json({status: 201, data: recipe[0], message: "Succesfully Recipes Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.getRecipesByEmail = async function (req, res, next){

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    var email = req.body.userEmail;

    var query = {
        userEmail : email
    }

    var filters = {
        name : req.body.name,
        ingredients : req.body.ingredients.split(','),
        difficulty : parseInt(req.body.difficulty),
        categories : req.body.categories.split(',')
    }

    const filterByIngredients = filters.ingredients[0] !== ''
    addFiltersToQuery(query, filters)    

    try {
        var recipes = await RecipeService.getRecipes(query, page, limit)

        recipes = recipes.filter((itr) => {

            let matchIngrendients = true;

            if (filterByIngredients)
                matchIngrendients = filters.ingredients.every(userIngredient => {
                    return itr.ingredients.find(recipeIngredient => {
                        return prefixStr(recipeIngredient, userIngredient)
                    }) !== undefined
                })

            return matchIngrendients
        })

        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(201).json({status: 201, data: recipes, message: "Succesfully Recipes Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.updateRecipe = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.idRecipe) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
    
    var Recipe = {
        id : req.body.idRecipe,
        name:req.body.name ,
        ingredients: req.body.ingredients.split(','),
        categories: req.body.categories.split(','),
        difficulty:req.body.difficulty,
        process : req.body.process,
        averageMark: req.body.averageMark,
        countMark:req.body.countMark,
        photo: req.body.photo,
        state : req.body.state,
        userEmail:req.body.userEmail 

    }

    console.log("Receta en Controller: ", Recipe);

    try {
        var updatedRecipe = await RecipeService.updateRecipe(Recipe)
        return res.status(201).json({status: 201, data: updatedRecipe, message: "Succesfully Updated Recipe"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.deleteRecipe = async function (req, res, next) {

    console.log(req);
    var id = parseInt(req.body.idRecipe);
    console.log("Id Recipe Deleted: ", id)

    try {
        var deletedRecipe = await RecipeService.deleteRecipe(id);
        return res.status(201).json({status: 201, data: deletedRecipe, message: "Succesfully Deleted Recipe"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.uploadRecipeImage = async function (req, res, next) {
    console.log("ImgUser",req.body)
    // Id is necessary for the update
    if (!req.body.email) {
        return res.status(400).json({status: 400., message: "Mail must be present"})
    }

    let recipeImg = {
        email: req.body.email,
        imageName : req.body.imageName
    }
    
    try {

        if (recipeImg.imageName!=='')
            var newUserImg = await RecipeService.createRecipeImg(recipeImg);
        
        return res.status(201).json({status: 201, message: "Imagen cargada", imgUrl : newUserImg});
        
    } catch (e) {
        console.log("error guardar imagen", e)
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.createRecipe = async function (req, res, next) {
    var recipe = {
        idRecipe: 0,
        name: req.body.name,
        photo: req.body.photo,
        state : req.body.state,
        categories: req.body.categories.split(','),
        ingredients: req.body.ingredients.split(','),
        difficulty: req.body.difficulty,
        process : req.body.process,
        averageMark: 0,
        countMark: 0,
        userEmail: req.body.userEmail
    }

    try {
        var createdRecipe = await RecipeService.createRecipe(recipe)
        return res.status(201).json({data : createdRecipe, message: "Succesfully Created Recipe"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}


exports.califyRecipe = async function (req, res, next) {

    var email = req.body.email;
    var calification = req.body.calification;
    var idRecipe = req.body.idRecipe;

    try {
        var calify = await RecipeService.califyRecipe(email,calification,idRecipe)
        res.status(201).send("Succesfully calify ");
    } catch (e) {
        console.log(e)
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}