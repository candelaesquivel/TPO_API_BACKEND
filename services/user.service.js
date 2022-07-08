// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var ServiceException = require('../exceptions/serviceException').ServiceException;
var ErrorCodes = require('../exceptions/serviceException').ErrorCodes;

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
        throw new ServiceException('Error al extraer los usuarios de la base de datos', ErrorCodes.ERROR_IN_DB_OPERATION);
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
            throw new ServiceException("Email esta en uso por otra cuenta", ErrorCodes.ERROR_MAIL_IN_USE)
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e) 

        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error al crear el usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}

exports.updateUserData = async function (user){
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne({email : user.email});
    } catch (e) {
        throw new ServiceException("Error al actualizar los datos del usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
    // If no old User Object exists return false
    if (!oldUser) {
        console.log('Usuario No conseguido')
        return false;
    }
    else
        console.log("Old User Servicio: ", oldUser)
    //Edit the User Object
    oldUser.name = user.name
    oldUser.lastName = user.lastName
    oldUser.phone = user.phone
    try {
        var savedUser = await oldUser.save()

        var userReturnData = {
            name : savedUser.name,
            lastName : savedUser.lastName,
            phone : savedUser.phone,
            email : savedUser.email
        }

        return userReturnData;
    } catch (e) {
        throw new ServiceException("Error al actualizar los datos del usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}

exports.updateUser = async function (user) {
    
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne({email : user.email});
    } catch (e) {
        throw new ServiceException("Error al actualizar el usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
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
        throw new ServiceException("Error al actualizar el usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}


exports.loginUser = async function (logInUser) {
   
    try {
        
        var exists = await User.exists({email : logInUser.email})

        if (exists)
        {
            var userData = await User.findOne({email : logInUser.email})
            var passwordIsValid = bcrypt.compareSync(logInUser.password,userData.password);
            if (!passwordIsValid) 
                throw new ServiceException("Contraseña no es valida", ErrorCodes.ERROR_PASSWORD_NOT_VALID)

            var token = jwt.sign({
                id: userData._id
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });

            var userReturnData = {
                name : userData.name,
                lastName : userData.lastName,
                phone : userData.phone,
                email : userData.email
            }

            return {token:token, user: userReturnData };
        }
        else
            throw new ServiceException("El correo no esta asociado a ninguna cuenta", ErrorCodes.ERROR_MAIL_NOT_ASSOCIATED)
    } catch (e) {
        // return a Error message describing the reason 
        console.log("Mensaje Service", e)
        
        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error al logear el usuario", ErrorCodes.ERROR_IN_DB_OPERATION)
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
            throw new ServiceException("El correo no esta asociado a ninguna cuenta", ErrorCodes.ERROR_MAIL_NOT_ASSOCIATED)
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)

        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error buscando la pregunta de seguridad", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}

exports.checkSecurityAnswer = async function (user) {
   
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
                throw new ServiceException("Respuesta Invalida", ErrorCodes.ERROR_SECURITY_ANSWER_WRONG)
            }
            return result;
        }
        else
            throw new ServiceException("El correo no esta asociado a ninguna cuenta", ErrorCodes.ERROR_MAIL_NOT_ASSOCIATED)
    } catch (e) {
        // return a Error message describing the reason
        console.log(e)    

        if (e instanceof ServiceException)
            throw e;
        else
            throw new ServiceException("Error mientras se validaba la respuesta de seguridad", ErrorCodes.ERROR_IN_DB_OPERATION)
    }
}