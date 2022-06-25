// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this
var mongoose = require('mongoose')

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query)
        var Users = await User.find({}).lean()
        // Return the Userd list that was retured by the mongoose promise
        console.log(Users);
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Users');
    }
}


exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);

    var newUser = new User({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        securityQ: user.securityQ,
        answer: user.answer
    })

    try {
        // Saving the User 
        var exists = await User.exists({email : newUser.email})

        if (!exists)
        {
            var savedUser = await newUser.save();
            var token = jwt.sign({
                id: savedUser._id
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            return token;
        }
        else
            throw Error("Email is used by another user")
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating User")
    }
}

exports.updateUser = async function (user) {
    
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne({email : user.email});
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        console.log('Usuario No conseguido')
        return false;
    }
    else
        console.log("Old User Servicio: ", oldUser)
    //Edit the User Object
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    oldUser.name = user.name
    oldUser.lastName = user.lastName
    oldUser.email = user.email
    oldUser.password = hashedPassword
    oldUser.phone = user.phone
    oldUser.securityQ = user.securityQ
    oldUser.answer = user.answer
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}


exports.loginUser = async function (logInUser) {
   
    try {
        
        var exists = await User.exists({email : logInUser.email})

        if (exists)
        {
            var userData = await User.findOne({email : logInUser.email})
            var passwordIsValid = bcrypt.compareSync(logInUser.password,userData.password);
            if (!passwordIsValid) throw Error("Invalid username/password")

            var token = jwt.sign({
                id: userData._id
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            return {token:token, user: userData };
        }
        else
            throw Error("Email is not linked to an user")
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Log in User")
    }
}

exports.getSecurityQuestionUser = async function (emailSecurity) {
   
    console.log("Email Recibido: ", emailSecurity)


    try {
        
        var exists = await User.exists({email : emailSecurity})
        if (exists)
        {
            var userData = await User.findOne({email : emailSecurity}  )
            return userData.securityQ;
        }
        else
            throw Error("Email is not linked to an user")
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while looking for the question")
    }
}

exports.checkSecurityAnswer = async function (user) {
   
    console.log("Pregunta recibida: ", user.answer)


    try {
        
        var exists = await User.exists({email : user.email})
        if (exists)
        {   
            var result = false
            var userFind = await User.findOne({email : user.email}  )
            if (user.answer === userFind.answer){
                var result = true
            }
            else{
                throw Error("Answer invalid")
            }
            return result;
        }
        else
            throw Error("Email invalid")
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while comparing answers")
    }
}