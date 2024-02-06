const BaseModel = require('./models/BaseModel');

const users =  function () {
    return new BaseModel('users');
}

const oauthTokens =  function () {
    return new BaseModel('auth_tokens');
}

const userTokens = (userId) => function () {
    return oauthTokens().where('user_id', userId).get();
}

module.exports =  {
    users, oauthTokens, userTokens
}