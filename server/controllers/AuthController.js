const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const Controller = require("./Controller")
const BaseModel = require("../models/BaseModel");
const model = new BaseModel('oauth_tokens');
const models =  require('../models')

class AuthController extends Controller {
    async getAuthInfo(req, res)
    {
        try {

            const tokenInRequest = req.header(process.env.TOKEN_HEADER_KEY);

            const tokenInDb = await models.oauthTokens().where('access_token', tokenInRequest).first();

            if (tokenInDb && jwt.verify(tokenInRequest, process.env.JWT_SECRET_KEY)) {
                return res.json(jwt.decode(tokenInRequest));
            } else {
                return res.status(401).json({'success' : false, 'logs' : 'Unauthorised token' });
            }

        } catch (error) {
            console.log(error);
            return res.status(401).json({'success' : false, 'logs' : error });
        }
    }

    async postLogin (req, res)
    {
        const user = await models.users().where('email', req.query.email).first();

        if (!user) {
            res.json({
               success : false,
               message : 'Invalid credentials'
            });
        }

        if (!(await bcrypt.compare(req.query.password, user['password']))) {
            res.json({
                success : false,
                message : 'Invalid credentials'
            });
        } else {
            const token = await super.createToken(user);
            res.json({
                'success' : true, 'data' : {
                    'token' : token
                }
            })
        }
    }


    async postLogout (req, res)
    {
        const value = await models.oauthTokens().where('access_token', req.headers['x-auth']).first()

        if (value) {
            model.execute('DELETE FROM auth_tokens where `access_token` = '+ '"' + value['access_token']+'"').then( data => {
                res.json({
                    'success' : true,
                    'message' : 'Logged Out successfully'
                })
            }).catch(err => {
                res.json({
                    'success' : false,
                    'logs' : err
                })
                this.reportErr(err)
            })
        }else {
            res.json({
                'success' : true,
                'message' : 'Invalid Token'
            })
        }
    }
}

module.exports = AuthController;