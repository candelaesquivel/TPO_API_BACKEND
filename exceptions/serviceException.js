function ServiceException(message, errorCode)
{
    this.message = message;
    this.errorCode = errorCode;
}

const ErrorCodes = {
    ERROR_PASSWORD_NOT_VALID    : 1,
    ERROR_MAIL_NOT_ASSOCIATED   : 2,
    ERROR_SECURITY_ANSWER_WRONG : 3,
    ERROR_MAIL_IN_USE           : 4,
    ERROR_IN_DB_OPERATION       : 5,
    ERROR_RECIPE_NOT_FOUND      : 6,
    ERROR_RECIPE_ID_IN_USE      : 7,
    ERROR_DUPLICATE_CALIFY      : 8
}

module.exports = { ServiceException, ErrorCodes };