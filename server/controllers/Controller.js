const BaseModel = require('../models/BaseModel');
const jwt = require("jsonwebtoken");
const model = new BaseModel();
const models = require('../models')
class Controller {
    reportErr(err) {
        console.log(err);
    }

    async createToken(user, expiresIn= 10) {
        const tokenValue = jwt.sign({
            loggedInAt: Date(),
            userData: user
        }, process.env.JWT_SECRET_KEY)
        const values = user['id'] +', "'+ tokenValue +'"';

        await model.execute('INSERT INTO auth_tokens (`user_id`, `access_token`) VALUES (' + values + ')')

        return tokenValue;
    }
}

module.exports = Controller;