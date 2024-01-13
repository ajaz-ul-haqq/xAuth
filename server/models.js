const BaseModel = require('./models/BaseModel');

const users =  function () {
    return new BaseModel('users');
}

const oauthTokens =  function () {
    return new BaseModel('auth_tokens');
}

module.exports =  {
    users, oauthTokens
}