var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var CalificationUserSchema = new mongoose.Schema({
    email: String,
    calification: Number,
    idRecipe: Number
})

CalificationUserSchema.plugin(mongoosePaginate)
const CalificationUser = mongoose.model('calificationUsers', CalificationUserSchema)

module.exports = CalificationUser;