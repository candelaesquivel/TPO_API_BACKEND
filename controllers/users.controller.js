var UserService = require('../services/user.service');
// Saving the context of this module inside the _the variable
_this = this;

exports.getUsers = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(201).json({status: 201, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("LLegue al controller de registro",req.body)
    
    var User = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        securityQ : req.body.securityQ,
        answer : req.body.answer
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({createdUser, message: "Succesfully Created User"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.updateUserData = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.email) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
    
    var User = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
    }

    try {
        var updatedUser = await UserService.updateUserData(User);
        return res.status(201).json({status: 201, userData: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.updateUserPassword = async function(req, res, next) {
    
    var User = {
        currentPassword : req.body.currentPassword,
        email: req.body.email,
        newPassword: req.body.newPassword
    }

    try {
        var updatedUser = await UserService.updateUserPassword(User);
        return res.status(201).json({status: 201, message: "Password actualizado correctamente"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.updateUser = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.email) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
    
    var User = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        securityQ : req.body.securityQ,
        answer : req.body.answer
    }

    console.log("Usuario en Controller: ", User);

    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(201).json({status: 201, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body",req.body)
    var User = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        return res.status(201).json({loginUser, message: "Succesfully login"})
    } catch (e) {
        console.log("Exception:", e)
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.getSecurityQuestionUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body",req.body)
    var User = {
        email: req.body.email,
    }
    try {
        var question = await UserService.getSecurityQuestionUser(User.email);
        return res.status(201).json({data : question, message: "Question find"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}

exports.checkSecurityAnswer = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body",req.body)
    var User = {
        email: req.body.email,
        answer: req.body.answer,
    }
    try {
        var isAnswerValid = await UserService.checkSecurityAnswer(User);
        return res.status(201).json({data : isAnswerValid, message: "Answer correct"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message, errorCode : e.errorCode})
    }
}