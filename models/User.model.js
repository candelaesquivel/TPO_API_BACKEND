var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var UserSchema = new mongoose.Schema({
    name: String,
    lastName:String,
    email: String,
    password: String,
    phone:String,
    securityQ:String,
    answer: String
},

{ collection : 'users'}

)

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User;