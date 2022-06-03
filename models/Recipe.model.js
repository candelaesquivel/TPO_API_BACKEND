var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var RecipeSchema = new mongoose.Schema({
    name: String,
    ingredients: Array,
    idCategory: Number,
    difficulty: Number,
    process : String,
    averageMark: Number,
    countMark: Number,
    photo: String,
    publicationStatus : Number,
    userEmail: String

})

RecipeSchema.plugin(mongoosePaginate)
const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe;